<template>
  <div id="map-three" ref="hubeiThree" style="width: 100%; height: 100%;">
    {{ $store.state.global.currentIndex }}
  </div>
</template>

<script>
import hubei from '../../../../public/hubeiplan.json'
import { mapState } from 'vuex'

export default {
  name: 'MapChartThree',
  data () {
    return {
      chartInstance: null,
      mapOption: [],
      areaRegions: []
    }
  },
  computed: {
    ...mapState({
      timeList: (state) => state.data.timeList,
      mapData: (state) => state.data.threeMapData,
      planMap: (state) => state.data.planTypeMap,
      indexName: (state) => state.global.currentIndexName,
      cityImage: (state) => state.global.cityImage,
      ecologyImage: (state) => state.global.ecologyImage,
      agricultureImage: (state) => state.global.agricultureImage
    })
  },
  methods: {
    initChart () {
      this.$echarts.registerMap('hubeiMapThree', hubei)
      this.chartInstance = this.$echarts.init(this.$refs.hubeiThree)
    },
    initArea () {
      hubei.features.map(item => {
        const tmp = {
          name: item.properties.name,
          itemStyle: {
            areaColor: ''
          }
        }
        if (this.planMap[1].includes(item.properties.name)) {
          tmp.itemStyle.areaColor = '#E56665'
        } else if (this.planMap[2].includes(item.properties.name)) {
          tmp.itemStyle.areaColor = '#98CC72'
        } else {
          tmp.itemStyle.areaColor = '#F5C753'
        }
        this.areaRegions.push(tmp)
      })
    },
    getData () {
      this.initArea()
      this.getOption()
      this.updateChart()
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
            map: 'hubeiMapThree',
            zoom: 0.8,
            roam: true,
            left: '8%',
            top: '10%',
            itemStyle: {
              areaColor: 'rgba(255,255,255,0.2)',
              borderColor: '#53D9FF',
              borderWidth: 0
            },
            regions: this.areaRegions
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '20%',
              right: '-60%',
              bottom: '50%',
              label: {
                formatter: (p) => {
                  return p.name + p.value.toFixed(2)
                },
                color: '#6E7079'
              },
              itemStyle: {
                color: p => {
                  return p.name === '城市发展区' ? '#E56665' : (p.name === '重点生态功能区' ? '#98CC72' : '#F5C753')
                }
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        },
        options: this.mapOption
      }
      this.chartInstance.setOption(option)
    },
    getOption () {
      this.mapOption = []
      const n = this.timeList.length
      for (let i = 0; i < n; i++) {
        const tmp = {
          title: {
            text: ''
          },
          series: []
        }
        tmp.title.text = this.timeList[i] + '年湖北省三大分区指标'
        // bar的数据
        tmp.series.push({
          data: this.mapData[this.timeList[i]]
        })
        this.mapOption.push(tmp)
      }
    },
    screenAdapter () {
      this.chartInstance.resize()
    }
  },
  mounted () {
    this.initChart()
    this.getData()
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

</style>
