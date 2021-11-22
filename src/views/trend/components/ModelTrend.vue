<template>
  <div class="model-trend">
    <div class="trend-filter">
      <el-select v-model="belong" filterable placeholder="城市群/圈" style="margin-right: 10px" @change="changeCityA">
        <el-option
          v-for="item in citiesBelong"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="cityA" filterable placeholder="请选择参考城市" style="margin-right: 10px">
        <el-option
          v-for="(item, index) in citiesA"
          :key="index"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="Time" filterable placeholder="所有年限" :clearable="true" style="margin-right: 10px">
        <el-option
          v-for="(item, index) in timeList"
          :key="index"
          :label="item"
          :value="item">
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
    <div class="trend-chart" ref="model">
    </div>
  </div>
</template>

<script>
import { fetchList, fetchTimeList } from '@/network/correlation'

export default {
  name: 'ModelTrend',
  data () {
    return {
      belong: 1,
      cityA: '武汉市',
      Time: null,
      timeList: [],
      citiesBelong: [
        { label: '武汉1+8城市圈', value: 1 },
        { label: '襄十随神城市群', value: 2 },
        { label: '宜荆荆恩城市群', value: 3 }
      ],
      xData: [],
      yData: [],
      chartInstance: null
    }
  },
  computed: {
    citiesA () {
      if (this.belong === 1) {
        return [
          '武汉市',
          '黄石市',
          '鄂州市',
          '孝感市',
          '黄冈市',
          '咸宁市',
          '仙桃市',
          '潜江市',
          '天门市'
        ]
      } else if (this.belong === 2) {
        return [
          '襄阳市',
          '十堰市',
          '随州市',
          '神农架林区'
        ]
      } else {
        return [
          '宜昌市',
          '荆州市',
          '荆门市',
          '恩施土家族苗族自治州'
        ]
      }
    },
    chartTitle () {
      const pre = this.citiesBelong.filter(item => item.value === this.belong)[0].label
      return pre + '之' + this.cityAB + '关联度趋势分析'
    }
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.model)
    },
    changeCityA () {
      this.cityA = this.citiesA[0]
    },
    updateChart () {
      const xData = this.xData
      const yData = this.yData
      const series = this.getSeries(yData)
      const titleName = this.Time ? this.Time + '关联度与人口迁徙对比图' : '关联度与人口迁徙对比图'
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        title: {
          top: '3%',
          left: 'center',
          text: titleName,
          textStyle: {
            color: '#C0C4CC'
          }
        },
        grid: {
          left: '0%',
          right: '2%',
          containLabel: true
        },
        legend: {
          data: series.map(s => s.name),
          bottom: '3%',
          textStyle: {
            color: '#f6f6f6'
          }
        },
        toolbox: {
          top: '3%',
          show: true,
          left: 'right',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            axisLabel: {
              color: 'rgba(255,255,255,.6)',
              fontSize: '12'
            },
            axisLine: {
              show: false
            },
            data: xData
          }
        ],
        yAxis: [
          {
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
            }
          }
        ],
        series
      }
      this.chartInstance.setOption(option, true)
    },
    getSeries (yData) {
      const labelOption = {
        show: true,
        position: 'insideBottom',
        distance: 15,
        align: 'left',
        verticalAlign: 'middle',
        rotate: 90,
        formatter: '{c} {name|{a}}',
        fontSize: 16,
        rich: {
          name: {}
        }
      }
      const res = []
      for (let i = 0, n = this.yData.length; i < n; i++) {
        const tmp = {
          name: '',
          type: 'bar',
          barGap: 0,
          label: labelOption,
          emphasis: {
            focus: 'series'
          },
          data: null
        }
        if (this.Time) {
          i === 0 ? tmp.name = this.Time + '关联度' : (i !== n - 1 ? tmp.name = '2021人口迁徙' + '(' + this.cityA + ')' : tmp.name = '2021人口迁徙' + '(其它)')
        } else {
          i < this.timeList.length ? tmp.name = this.timeList[i] + '关联度' : (i !== n - 1 ? tmp.name = '2021人口迁徙' + '(' + this.cityA + ')' : tmp.name = '2021人口迁徙' + '(其它)')
        }
        tmp.data = yData[i]
        res.push(tmp)
      }
      return res
    },
    async handleFilter () {
      const query = {}
      query.Belong = this.belong
      query.CityName1 = this.cityA
      query.Time = this.Time
      let res = await fetchList(query)
      this.xData = []
      this.yData = []
      res = res.data.filter(d => d.CityName1 === d.migration.CityName1 && d.CityName2 === d.migration.CityName2)
      this.xData = [...new Set(res.map(d => d.CityName2))]
      if (this.Time) {
        this.yData.push(res.map(d => d.Value))
        this.yData.push(res.map(d => d.migration.Migrate1))
        this.yData.push(res.map(d => d.migration.Migrate2))
      } else {
        for (let i = 0, n = this.timeList.length; i < n; i++) {
          const tmp = res.filter(d => d.Time === this.timeList[i])
          this.yData.push(tmp.map(item => item.Value))
          if (i === n - 1) {
            this.yData.push(tmp.map(item => item.migration.Migrate1))
            this.yData.push(tmp.map(item => item.migration.Migrate2))
          }
        }
      }
      this.updateChart()
    },
    async getTimeList () {
      const res = await fetchTimeList()
      this.timeList = res.data.map(item => item.Time)
    },
    screenAdapter () {
      this.chartInstance.resize()
    }
  },
  mounted () {
    this.initChart()
    this.getTimeList()
    this.handleFilter()
    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>

<style scoped>

</style>
