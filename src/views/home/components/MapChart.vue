<template>
  <div id="map-chart" ref="hubei" style="width: 100%; height: 100%;" @dblclick="revertMap">
    {{ $store.state.global.currentIndex }}
  </div>
</template>

<script>
import axios from 'axios'
import hubei from '../../../../public/hubei.json'
import { mapState } from 'vuex'
import { fetchValue } from '@/network/value'
import { fetchPlanning } from '@/network/planning'
import { getProvinceMapInfo } from '@/utils/map_utils'

export default {
  name: 'MapChart',
  data () {
    return {
      // 0对应市级，当为1时不再下钻
      currentView: 0,
      timeList: [],
      chartInstance: null,
      mapData: [],
      mapOption: [],
      yData: [],
      scatterData: {},
      valueQuery: {
        id: 1
      }
    }
  },
  computed: {
    ...mapState({
      planMap: (state) => state.data.planTypeMap,
      cityImage: (state) => state.global.cityImage,
      ecologyImage: (state) => state.global.ecologyImage,
      agricultureImage: (state) => state.global.agricultureImage
    })
  },
  methods: {
    initChart () {
      this.$echarts.registerMap('hubeiMap', hubei)
      this.chartInstance = this.$echarts.init(this.$refs.hubei)
      this.chartInstance.on('click', async arg => {
        if (this.currentView) { return }
        this.currentView = 1
        const center = hubei.features.filter(item => item.properties.name === arg.name)[0].properties.centroid
        // arg.name 得到所点击的省份, 这个省份他是中文
        const provinceInfo = getProvinceMapInfo(arg.name)
        const ret = await axios.get('./' + provinceInfo.path)
        this.$echarts.registerMap(provinceInfo.key, ret.data)
        // 根据点击地图名字获取展示数据
        this.mapData = this.$store.state.data.planMapData[arg.name]
        this.yData = ret.data.features.map(item => {
          return item.properties.name
        })
        const result = {}
        this.timeList.map(year => {
          result[year] = ret.data.features.map(item => {
            const newItem = {}
            newItem.name = item.properties.name
            const region = this.mapData[year].filter(item => item.name === newItem.name)[0]
            let value
            // 某个市下，只有个别区有数据，其他的可能没有。没有赋值为0
            if (!region) {
              value = 0
            } else {
              value = region.value
            }
            if (!item.properties.centroid) {
              newItem.value = [...item.properties.center, value]
            } else {
              newItem.value = [...item.properties.centroid, value]
            }
            return newItem
          })
        })
        this.scatterData = result
        this.getOption()
        const changeOption = {
          geo: {
            type: 'map',
            map: provinceInfo.key,
            zoom: 0.8,
            roam: true, // 设置允许缩放以及拖动的效果
            center,
            left: '8%',
            top: '10%'
          },
          yAxis: {
            data: this.yData
          },
          options: this.mapOption
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    initStore (data, map) {
      this.$store.commit('data/initRegionMap', map)
      this.$store.commit('data/initValueList', data)
      this.$store.commit('data/initTimeList')
      this.$store.commit('data/initMapData')
      this.$store.commit('data/initThreeData')
      this.$store.commit('global/alterPlanVisual')
    },
    async getData (query) {
      if (!this.$store.state.data.valueList.length) {
        const { data } = await fetchValue(query)
        // 这里没必要再次请求，先这样吧
        const regionMap = await fetchPlanning()
        const map = regionMap.data
        this.initStore(data, map)
      }
      this.getAdminMapData()
      this.getOption()
      this.updateChart()
    },
    getAdminMapData () {
      this.timeList = this.$store.state.data.timeList
      this.yData = [...new Set(this.$store.state.data.adminRegionMap.map(item => item.Name_CH))]
      this.mapData = this.$store.state.data.adminMapData
      // This process scatter points data
      const result = {}
      this.timeList.map(year => {
        result[year] = hubei.features.map(item => {
          const newItem = {}
          newItem.name = item.properties.name
          newItem.value = [...item.properties.centroid, this.mapData[year].filter(item => item.name === newItem.name)[0].value]
          return newItem
        })
      })
      this.scatterData = result
    },
    getOption () {
      this.mapOption = []
      const n = this.timeList.length
      for (let i = 0; i < n; i++) {
        const { max, min } = this.mapData[this.timeList[i]][this.mapData[this.timeList[i]].length - 1]
        const tmp = {
          title: {
            text: ''
          },
          visualMap: {
            max: max,
            min: min
          },
          series: []
        }
        tmp.title.text = this.timeList[i] + '年湖北省行政区划指标'
        // map的数据
        tmp.series.push({
          data: this.mapData[this.timeList[i]]
        })
        // scatter的数据
        const city = []
        const ecology = []
        const agriculture = []
        this.scatterData[this.timeList[i]].map(item => {
          if (this.planMap[1].includes(item.name)) {
            city.push(item)
          } else if (this.planMap[2].includes(item.name)) {
            ecology.push(item)
          } else if (this.planMap[3].includes(item.name)) {
            agriculture.push(item)
          } else {
            return []
          }
        })
        tmp.series.push({
          symbolSize: function (val) {
            // return (val[2] - min) / (max - min) * 50
            return 30
          },
          data: city
        })
        tmp.series.push({
          symbolSize: function (val) {
            // return (val[2] - min) / (max - min) * 50
            return 30
          },
          data: ecology
        })
        tmp.series.push({
          symbolSize: function (val) {
            // return (val[2] - min) / (max - min) * 50
            return 30
          },
          data: agriculture
        })
        // bar的数据
        tmp.series.push({
          data: this.mapData[this.timeList[i]]
        })
        this.mapOption.push(tmp)
      }
    },
    updateChart () {
      const option = {
        baseOption: {
          timeline: {
            axisType: 'category',
            autoPlay: false,
            playInterval: 3000,
            data: this.timeList
          },
          title: {
            left: 'left',
            subtext: '当前指标：' + this.$store.state.global.currentIndexName,
            textStyle: {
              color: '#6E7079',
              fontSize: 20
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: (p) => {
              let val = p.value
              if (window.isNaN(val)) {
                val = 0
              }
              const txtCon =
                "<div style='text-align:left'>" + p.name + ': ' + val.toFixed(2) + '</div>'
              return txtCon
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            },
            right: '25%'
          },
          legend: {
            right: '30%',
            itemHeight: 20,
            textStyle: {
              color: 'skyblue'
            },
            data: [{
              name: '城市发展区',
              icon: this.cityImage
            }, {
              name: '重点生态功能区',
              icon: this.ecologyImage
            }, {
              name: '农产品主产区',
              icon: this.agricultureImage
            }]
          },
          grid: {
            right: '2%',
            top: '5%',
            bottom: '8%',
            width: '20%'
          },
          geo: {
            type: 'map',
            map: 'hubeiMap', // chinaMap需要和registerMap中的第一个参数保持一致
            zoom: 0.8,
            roam: true, // 设置允许缩放以及拖动的效果
            left: '8%',
            top: '10%',
            tooltip: {
              trigger: 'item',
              formatter: (p) => {
                let val = p.value
                if (window.isNaN(val)) {
                  val = 0
                }
                const txtCon =
                  "<div style='text-align:left'>" + p.name + ': ' + val.toFixed(2) + '</div>'
                return txtCon
              }
            },
            label: {
              show: true,
              color: 'rgb(249, 249, 249)'
            },
            itemStyle: {
              areaColor: '#24CFF4',
              borderColor: '#53D9FF',
              borderWidth: 1.3,
              shadowBlur: 15,
              shadowColor: 'rgb(58,115,192)',
              shadowOffsetX: 7,
              shadowOffsetY: 6
            },
            emphasis: {
              itemStyle: {
                areaColor: '#8dd7fc',
                borderWidth: 1.6,
                shadowBlur: 25
              },
              label: {
                show: true,
                color: '#f75a00'
              }
            }
          },
          visualMap: {
            type: 'continuous',
            left: '3%',
            bottom: '10%',
            calculable: true,
            seriesIndex: [0],
            colorLightness: [0.8, 100],
            precision: 2,
            inRange: {
              color: ['#5ab1ef', '#e5cf0d', '#c05050']
            },
            textStyle: {
              color: '#24CFF4'
            }
          },
          xAxis: {
            type: 'value',
            scale: true,
            position: 'top',
            boundaryGap: false,
            splitLine: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              margin: 2,
              color: '#c0e6f9'
            }
          },
          yAxis: {
            type: 'category',
            nameGap: 16,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#455B77'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
              color: '#c0e6f9'
            },
            data: this.yData
          },
          series: [
            { name: 'hubeiMap', type: 'map', geoIndex: 0 },
            {
              name: '城市发展区',
              type: 'scatter',
              coordinateSystem: 'geo',
              symbol: this.cityImage,
              tooltip: {
                trigger: 'item',
                formatter: (p) => {
                  let val = p.value[2]
                  if (window.isNaN(val)) {
                    val = 0
                  }
                  const txtCon =
                    "<div style='text-align:left'>" + p.name + ': ' + val.toFixed(2) + '</div>'
                  return txtCon
                }
              },
              itemStyle: {
                color: '#F4E925',
                // color: '#fff',
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            {
              name: '重点生态功能区',
              type: 'scatter',
              coordinateSystem: 'geo',
              symbol: this.ecologyImage,
              tooltip: {
                trigger: 'item',
                formatter: (p) => {
                  let val = p.value[2]
                  if (window.isNaN(val)) {
                    val = 0
                  }
                  const txtCon =
                    "<div style='text-align:left'>" + p.name + ': ' + val.toFixed(2) + '</div>'
                  return txtCon
                }
              },
              itemStyle: {
                color: '#F4E925',
                // color: '#fff',
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            {
              name: '农产品主产区',
              type: 'scatter',
              coordinateSystem: 'geo',
              symbol: this.agricultureImage,
              tooltip: {
                trigger: 'item',
                formatter: (p) => {
                  let val = p.value[2]
                  if (window.isNaN(val)) {
                    val = 0
                  }
                  const txtCon =
                    "<div style='text-align:left'>" + p.name + ': ' + val.toFixed(2) + '</div>'
                  return txtCon
                }
              },
              itemStyle: {
                color: '#F4E925',
                // color: '#fff',
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            {
              name: 'hubeiBar',
              type: 'bar',
              barMaxWidth: 15,
              label: {
                show: true,
                position: 'insideLeft',
                color: '#fff',
                fontSize: 12,
                formatter: (p) => {
                  const value = p.value.toFixed(2)
                  return p.name.slice(0, 2) + ': ' + value
                }
              },
              itemStyle: {
                color: '#11AAFE',
                borderRadius: [0, 30, 30, 0]
              }
            }
          ]
        },
        options: this.mapOption
      }
      this.chartInstance.setOption(option)
    },
    screenAdapter () {
      this.chartInstance.resize()
    },
    revertMap () {
      if (!this.currentView) { return }
      this.currentView = 0
      this.getAdminMapData()
      this.getOption()
      const revertOption = {
        geo: {
          type: 'map',
          map: 'hubeiMap', // chinaMap需要和registerMap中的第一个参数保持一致
          zoom: 0.8,
          roam: true, // 设置允许缩放以及拖动的效果
          left: '8%',
          top: '10%',
          center: null
        },
        yAxis: {
          data: this.yData
        },
        options: this.mapOption
      }
      this.chartInstance.setOption(revertOption)
    }
  },
  mounted () {
    this.initChart()
    this.getData(this.valueQuery)
    window.addEventListener('resize', this.screenAdapter)
  },
  activated () {
    this.screenAdapter()
  },
  updated () {
    this.getAdminMapData()
    this.getOption()
    this.updateChart()
  },
  destroyed () {
    // 避免造成内存泄漏
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>

<style scoped>
#map-chart{
  height: 100%;
  width: 100%;
}
</style>
