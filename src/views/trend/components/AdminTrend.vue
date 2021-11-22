<template>
  <div class="admin-trend">
    <div class="trend-filter">
      <el-cascader
        v-model="$store.state.trend.cascaderIndexId"
        placeholder="指标名称"
        style="margin-right: 10px"
        :options="indexOption"
        @change="changeIndex($store.state.trend.cascaderIndexId[1])"
        filterable
      ></el-cascader>
      <el-select v-model="adminRegionId" filterable placeholder="行政分区" style="margin-right: 10px" @change="initPlan" :clearable="true">
        <el-option
          v-for="item in adminOption"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="planRegionId" filterable placeholder="全市" style="margin-right: 10px" :clearable="true">
        <el-option
          v-for="item in planOption"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item"
                 style="margin-right: 10px;z-index: 2021;"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter"
                 size="middle"
      >
        分析
      </el-button>
    </div>
    <div class="trend-chart" ref="admin">
      {{ $store.state.global.currentIndex }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchValue } from '@/network/value'

export default {
  name: 'AdminTrend',
  data () {
    return {
      chartInstance: null,
      indexOption: [],
      adminOption: [],
      adminRegionId: 1,
      adminName: '',
      planRegionId: null,
      planName: '',
      xData: [],
      yData: []
      // alarmValue: null
    }
  },
  computed: {
    ...mapState({
      factorList: (state) => state.global.factorList,
      factorCategory: (state) => state.global.factorCategory,
      adminRegionMap: (state) => state.data.adminRegionMap,
      planRegionMap: (state) => state.data.planRegionMap,
      adminMapData: (state) => state.data.adminMapData,
      planMapData: (state) => state.data.planMapData,
      currentIndexName: (state) => state.global.currentIndexName
    }),
    planOption () {
      return this.planRegionMap.filter(plan => plan.BelongRegionID === this.adminRegionId).map(item => {
        return {
          label: item.Name_CH,
          value: item.id
        }
      })
    }
  },
  methods: {
    initPlan () {
      this.planRegionId = this.planOption[0].id
    },
    handleFilter () {
      this.adminName = this.adminRegionMap.filter(admin => admin.id === this.adminRegionId)[0].Name_CH
      if (!this.planRegionId) {
        this.planName = ''
        this.xData = Object.keys(this.adminMapData)
        this.yData = []
        this.xData.map(year => {
          const tmp = this.adminMapData[year].filter(item => item.name === this.adminName)
          if (!tmp.length) {
            this.yData.push(0)
          } else {
            this.yData.push(+tmp[0].value.toFixed(2))
          }
        })
      } else {
        this.planName = this.planOption.filter(item => item.value === this.planRegionId)[0].label
        this.xData = Object.keys(this.planMapData[this.adminName])
        this.yData = []
        this.xData.map(year => {
          const tmp = this.planMapData[this.adminName][year].filter(item => item.name === this.planName)
          if (!tmp.length) {
            this.yData.push(0)
          } else {
            this.yData.push(+tmp[0].value.toFixed(2))
          }
        })
      }
      this.updateChart()
    },
    getOption () {
      const current = this.factorList.filter(item => item.id === this.$store.state.global.currentIndex)[0]
      this.$store.commit('trend/alterCascaderIndexId', [current.IndexType, this.$store.state.global.currentIndex])
      this.factorCategory.map(item => {
        const tmp = {
          value: null,
          label: '',
          children: []
        }
        tmp.value = item.IndexType
        tmp.label = item.label
        tmp.children = this.factorList.filter(factor => factor.IndexType === item.IndexType).map(item => {
          return {
            label: item.IndexName,
            value: item.id
          }
        })
        this.indexOption.push(tmp)
      })
      this.adminOption = this.adminRegionMap.map(item => {
        return {
          label: item.Name_CH,
          value: item.id
        }
      })
    },
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.admin)
    },
    updateChart () {
      // console.log(this.alarmValue)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        title: {
          top: '3%',
          left: 'center',
          text: this.adminName + this.planName + this.currentIndexName + '趋势分析',
          textStyle: {
            color: '#C0C4CC'
          }
        },
        grid: {
          left: '0%',
          right: '2%',
          containLabel: true
        },
        toolbox: {
          top: '3%',
          right: '0%',
          feature: {
            dataView: { show: true, readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            color: 'rgba(255,255,255,.6)',
            fontSize: '12'
          },
          axisLine: {
            show: false
          },
          data: this.xData
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1)'
            }
          },
          axisLabel: {
            color: 'rgba(255,255,255,.6)',
            fontSize: '12'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1)'
            }
          },
          min: Math.min(...this.yData)
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 50
        }],
        series: [
          {
            name: this.currentIndexName,
            type: 'line',
            label: {
              show: true,
              color: '#fff',
              position: 'top'
            },
            itemStyle: {
              color: 'rgba(128, 255, 165)'
            },
            // areaStyle: {
            //   opacity: 0.8,
            //   color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //     offset: 0,
            //     color: 'rgba(128, 255, 165)'
            //   }, {
            //     offset: 1,
            //     color: 'rgba(1, 191, 236)'
            //   }])
            // },
            data: this.yData
          }
        ]
      }
      this.chartInstance.setOption(option)
    },
    screenAdapter () {
      this.chartInstance.resize()
    },
    async changeIndex (index) {
      if (index === this.$store.state.global.currentIndex) {
        this.$message({
          message: '已在当前指标',
          type: 'success'
        })
      } else {
        const { data } = await fetchValue({ id: index })
        // this.alarmValue = this.factorList.filter(item => item.id === index)[0].AlarmValue
        // []不是false
        if (data.length) {
          this.$store.commit('global/alterIndex', index)
          this.$store.commit('data/initValueList', data)
          this.$store.commit('data/initTimeList')
          this.$store.commit('data/initMapData')
          this.$store.commit('data/initThreeData')
          this.handleFilter()
        } else {
          this.$message('指标未计算！')
          this.$store.commit('trend/alterCascaderIndexId', [1, 1])
        }
      }
    }
  },
  mounted () {
    this.getOption()
    this.initChart()
    this.handleFilter()
    window.addEventListener('resize', this.screenAdapter)
    this.$nextTick(() => {
      this.screenAdapter()
    })
  },
  updated () {
    this.$nextTick(() => {
      this.handleFilter()
      this.screenAdapter()
    })
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>

<style scoped>

</style>
