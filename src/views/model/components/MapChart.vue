<template>
  <div class="model-chart column" ref="model">
  </div>
</template>

<script>
import hubei from '../../../../public/hubei.json'

export default {
  name: 'MapChart',
  props: {
    correlationList: {
      type: Array,
      required: true,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      chartInstance: null,
      timeList: [],
      centerMap: {},
      maxSeriesData: [],
      middleSeriesData: [],
      minSeriesData: [],
      mapData: {},
      mapOption: []
    }
  },
  computed: {
    scatterData () {
      return hubei.features.map(item => {
        const newItem = {
          name: item.properties.name,
          value: item.properties.centroid
        }
        return newItem
      })
    }
  },
  mounted () {
    hubei.features.map(item => {
      this.centerMap[item.properties.name] = item.properties.centroid
    })
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.model)
      const initOption = {}
      this.chartInstance.setOption(initOption)
    },
    getData () {
      this.timeList = [...new Set(this.correlationList.map(cor => cor.Time))].sort((a, b) => a - b)
      this.getMapData()
      this.getOption()
      this.updateChart()
    },
    updateChart () {
      const nine = 'rgba(156,184,224,0.2)'
      const xsss = 'rgba(36,183,242,0.5)'
      const yjje = 'rgba(242,195,26,0.5)'
      // this.$echarts.registerMap('hubeiMap', hubei)
      const dataOption = {
        baseOption: {
          timeline: {
            axisType: 'category',
            autoPlay: false,
            playInterval: 5000,
            data: this.timeList
          },
          title: {
            textStyle: {
              color: '#C0C4CC'
            }
          },
          legend: {
            data: ['强相关', '中相关', '弱相关'],
            bottom: 40,
            right: 0,
            orient: 'vertical',
            textStyle: {
              color: '#fft'
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          geo: {
            type: 'map',
            map: 'hubeiMap', // chinaMap需要和registerMap中的第一个参数保持一致
            roam: true, // 设置允许缩放以及拖动的效果
            label: {
              show: true, // 展示标签
              color: 'rgb(249, 249, 249)'
            },
            itemStyle: {
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
              }
            },
            regions: [
              {
                name: '武汉市',
                itemStyle: {
                  areaColor: nine
                }
              },
              {
                name: '黄石市',
                itemStyle: {
                  areaColor: nine
                }
              },
              {
                name: '鄂州市',
                itemStyle: {
                  areaColor: nine
                }
              },
              {
                name: '孝感市',
                itemStyle: {
                  areaColor: nine
                }
              },
              {
                name: '黄冈市',
                itemStyle: {
                  areaColor: nine
                }
              },
              {
                name: '咸宁市',
                itemStyle: {
                  areaColor: nine
                }
              },
              {
                name: '仙桃市',
                itemStyle: {
                  areaColor: nine
                }
              },
              {
                name: '潜江市',
                itemStyle: {
                  areaColor: nine
                }
              },
              {
                name: '天门市',
                itemStyle: {
                  areaColor: nine
                }
              },
              {
                name: '襄阳市',
                itemStyle: {
                  areaColor: xsss
                }
              },
              {
                name: '十堰市',
                itemStyle: {
                  areaColor: xsss
                }
              },
              {
                name: '随州市',
                itemStyle: {
                  areaColor: xsss
                }
              },
              {
                name: '神农架林区',
                itemStyle: {
                  areaColor: xsss
                }
              },
              {
                name: '宜昌市',
                itemStyle: {
                  areaColor: yjje
                }
              },
              {
                name: '荆门市',
                itemStyle: {
                  areaColor: yjje
                }
              },
              {
                name: '荆州市',
                itemStyle: {
                  areaColor: yjje
                }
              },
              {
                name: '恩施土家族苗族自治州',
                itemStyle: {
                  areaColor: yjje
                }
              }
            ]
          },
          series: [
            {
              name: 'hubeiScatter',
              data: this.scatterData, // 配置散点的坐标数据
              type: 'effectScatter',
              coordinateSystem: 'geo', // 指明散点使用的坐标系统  geo的坐标系统
              rippleEffect: {
                brushType: 'fill'
              },
              itemStyle: {
                color: '#F4E925',
                shadowBlur: 10,
                shadowColor: '#333'
              },
              showEffectOn: 'render'
            },
            {
              name: '强相关',
              type: 'lines',
              coordinateSystem: 'geo',
              zlevel: 2,
              large: true,
              lineStyle: {
                color: '#df5a89',
                width: 6, // 尾迹线条宽度
                opacity: 0.6, // 尾迹线条透明度
                curveness: 0.2 // 尾迹线条曲直度
              },
              data: this.maxSeriesData
            },
            {
              name: '中相关',
              type: 'lines',
              coordinateSystem: 'geo',
              zlevel: 2,
              large: true,
              lineStyle: {
                color: '#f5db58',
                width: 3,
                curveness: 0.2
              },
              data: this.middleSeriesData
            },
            {
              name: '弱相关',
              type: 'lines',
              coordinateSystem: 'geo',
              zlevel: 2,
              large: true,
              lineStyle: {
                color: '#58a1f5',
                width: 2,
                curveness: 0.2
              },
              data: this.minSeriesData
            }
          ]
        },
        options: this.mapOption
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    getLines (city) {
      const res = []
      for (let i = 0; i < city.length; i++) {
        const tmp = { coords: [] }
        tmp.coords[0] = this.centerMap[city[i].CityName1]
        tmp.fromName = city[i].CityName1
        tmp.toName = city[i].CityName2
        tmp.coords[1] = this.centerMap[city[i].CityName2]
        res.push(tmp)
      }
      return res
    },
    getOption () {
      const n = this.timeList.length
      for (let i = 0; i < n; i++) {
        const tmp = {
          title: {
            text: ''
          },
          series: []
        }
        tmp.title.text = this.timeList[i] + '年湖北城市关联度'
        // hubeiScatter的数据，因为data不随时间的变化变化，加个空就行了
        tmp.series.push({
        })
        // 强相关的数据
        tmp.series.push({
          data: this.mapData[this.timeList[i]].maxSeriesData
        })
        // 中相关的数据
        tmp.series.push({
          data: this.mapData[this.timeList[i]].middleSeriesData
        })
        // 弱相关的数据
        tmp.series.push({
          data: this.mapData[this.timeList[i]].minSeriesData
        })
        this.mapOption.push(tmp)
      }
    },
    getMapData () {
      this.timeList.map(year => {
        this.mapData[year] = {
          maxSeriesData: [],
          middleSeriesData: [],
          minSeriesData: []
        }
        const nYearCorData = this.correlationList.filter(cor => cor.Time === year)
        nYearCorData.map(cor => {
          if (cor.Belong === 1) {
            this.divideRank(this.mapData[year], cor, 120, 90)
          } else if (cor.Belong === 2) {
            this.divideRank(this.mapData[year], cor, 500, 300)
          } else {
            this.divideRank(this.mapData[year], cor, 250, 200)
          }
        })
        this.mapData[year].maxSeriesData = this.getLines(this.mapData[year].maxSeriesData)
        this.mapData[year].middleSeriesData = this.getLines(this.mapData[year].middleSeriesData)
        this.mapData[year].minSeriesData = this.getLines(this.mapData[year].minSeriesData)
      })
    },
    divideRank (mapObj, obj, range1, range2) {
      if (obj.Value > range1) {
        mapObj.maxSeriesData.push(obj)
      } else if (obj.Value < range2) {
        mapObj.minSeriesData.push(obj)
      } else {
        mapObj.middleSeriesData.push(obj)
      }
    }
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

</style>
