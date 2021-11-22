<template>
  <div id="map-plan">
    <div id="map-chart-plan" ref="hubeiPlan" style="width: 100%; height: 100%;">
      {{ $store.state.global.currentIndex }}
    </div>
  </div>
</template>

<script>
import hubei from '../../../../public/hubeiplan.json'
import { mapState } from 'vuex'

export default {
  name: 'MapChartPlan',
  data () {
    return {
      chartInstance: null,
      mapOption: [],
      borderRegions: []
    }
  },
  computed: {
    ...mapState({
      timeList: (state) => state.data.timeList,
      mapData: (state) => state.data.planMapData2,
      planMap: (state) => state.data.planTypeMap,
      indexName: (state) => state.global.currentIndexName,
      cityImage: (state) => state.global.cityImage,
      ecologyImage: (state) => state.global.ecologyImage,
      agricultureImage: (state) => state.global.agricultureImage,
      cityColor: (state) => state.global.cityColor,
      ecologyColor: (state) => state.global.ecologyColor,
      agricultureColor: (state) => state.global.agricultureColor
    })
  },
  methods: {
    initChart () {
      this.$echarts.registerMap('hubeiMapPlan', hubei)
      this.chartInstance = this.$echarts.init(this.$refs.hubeiPlan)
      const initOption = {
        baseOption: {
          timeline: {
            axisType: 'category',
            autoPlay: false,
            playInterval: 3000,
            data: this.timeList
          },
          title: {
            left: 'left',
            textStyle: {
              color: '#6E7079',
              fontSize: 20
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
          grid: [
            { right: '2%', top: '5%', bottom: '8%', width: '20%' },
            { right: '2%', top: '7%', width: '20%', height: '38%' },
            { right: '2%', bottom: '10%', width: '20%', height: '38%' }
          ],
          geo: [
            {
              type: 'map',
              map: 'hubeiMapPlan',
              zoom: 0.8,
              roam: true,
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
                show: false,
                color: 'rgb(249, 249, 249)'
              },
              itemStyle: {
                areaColor: 'rgba(255,255,255,0.2)',
                borderColor: '#53D9FF',
                borderWidth: 1.3
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
              // regions: this.borderRegions
            }
          ],
          visualMap: {
            type: 'continuous',
            left: '3%',
            bottom: '10%',
            calculable: true,
            precision: 2,
            seriesIndex: [0],
            colorLightness: [0.8, 100],
            inRange: {
              color: ['#5ab1ef', '#e5cf0d', '#c05050']
            },
            textStyle: {
              color: '#24CFF4'
            }
          },
          dataZoom: {
            type: 'inside',
            start: 0,
            end: 100
          },
          xAxis: [
            {
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
              },
              gridIndex: 1
            },
            {
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
              },
              gridIndex: 2
            }
          ],
          yAxis: [
            {
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
              gridIndex: 1
            },
            {
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
              gridIndex: 2
            }
          ],
          series: [
            {
              name: 'Gy',
              type: 'map',
              geoIndex: 0
            },
            {
              name: '城市发展区',
              type: 'map',
              geoIndex: 0
            },
            {
              name: '重点生态功能区',
              type: 'map',
              geoIndex: 0
            },
            {
              name: '农产品主产区',
              type: 'map',
              geoIndex: 0
            },
            {
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
              },
              xAxisIndex: 0,
              yAxisIndex: 0
            },
            {
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
              },
              xAxisIndex: 1,
              yAxisIndex: 1
            }
          ]
        },
        options: []
      }
      this.chartInstance.setOption(initOption)
    },
    getData () {
      // this.getBorder()
      this.getOption()
      this.updateChart()
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
        tmp.title.text = this.timeList[i] + '年湖北省县级指标'
        const cityData = []
        const ecologyData = []
        const agricultureData = []
        this.mapData[this.timeList[i]].map(item => {
          if (this.planMap[1].includes(item.name)) {
            cityData.push(item)
          } else if (this.planMap[2].includes(item.name)) {
            ecologyData.push(item)
          } else if (this.planMap[3].includes(item.name)) {
            agricultureData.push(item)
          }
        })
        const total = [...cityData, ...ecologyData, ...agricultureData].sort((a, b) => b.value - a.value)
        const sliceLength = total.length > 19 ? 10 : (total.length > 9 ? 5 : 3)
        const preTen = total.slice(0, sliceLength)
        const postTen = total.slice(-1 - sliceLength, -1)
        tmp.series.push({
          data: []
        })
        // city的数据
        tmp.series.push({
          data: cityData
        })
        // ecology的数据
        tmp.series.push({
          data: ecologyData
        })
        // agriculture的数据
        tmp.series.push({
          data: agricultureData
        })
        tmp.series.push({
          data: preTen
        })
        tmp.series.push({
          data: postTen
        })
        this.mapOption.push(tmp)
      }
    },
    // getBorder () {
    //   hubei.features.map(item => {
    //     const tmp1 = {
    //       name: item.properties.name,
    //       itemStyle: {
    //         borderColor: ''
    //       }
    //     }
    //     // const tmp2 = {
    //     //   name: item.properties.name,
    //     //   itemStyle: {
    //     //     areaColor: ''
    //     //   }
    //     // }
    //     if (this.planMap[1].includes(item.properties.name)) {
    //       // tmp2.itemStyle.areaColor = '#E56665'
    //       tmp1.itemStyle.borderColor = this.cityColor
    //     } else if (this.planMap[2].includes(item.properties.name)) {
    //       // tmp2.itemStyle.areaColor = '#98CC72'
    //       tmp1.itemStyle.borderColor = this.ecologyColor
    //     } else {
    //       // tmp2.itemStyle.areaColor = '#F5C753'
    //       tmp1.itemStyle.borderColor = this.agricultureColor
    //     }
    //     this.borderRegions.push(tmp1)
    //     // this.areaRegions.push(tmp2)
    //   })
    // },
    updateChart () {
      const option = {
        baseOption: {
          title: {
            subtext: '当前指标：' + this.$store.state.global.currentIndexName
          }
        },
        options: this.mapOption
      }
      this.chartInstance.setOption(option)
    },
    screenAdapter () {
      this.chartInstance.resize()
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    // this.initThumbnail()
    window.addEventListener('resize', this.screenAdapter)
  },
  updated () {
    this.getOption()
    this.updateChart()
  },
  activated () {
    this.screenAdapter()
  },
  destroyed () {
    // 避免造成内存泄漏
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>

<style scoped>
#map-plan {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
