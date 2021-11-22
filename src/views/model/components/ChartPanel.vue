<template>
  <div :class="['panel', fullScreenStatus ? 'fullscreen' : '']">
    <el-carousel indicator-position="none" :interval="5000" height="100%">
      <el-carousel-item :key="1">
        <div class="panel-content" ref="line" style="width: 100%;height: 100%">
        </div>
      </el-carousel-item>
      <el-carousel-item :key="2">
        <div class="panel-content" ref="bar" style="width: 100%;height: 100%">
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="resize">
      <span @click="changeSize" :class="['iconfont', fullScreenStatus ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
    </div>
    <div class="panel-footer"></div>
  </div>
</template>

<script>
export default {
  name: 'ChartPanel',
  props: {
    cities: {
      type: Array,
      default () {
        return []
      },
      required: true
    },
    chartTitle: {
      type: String,
      required: true
    },
    migration: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      lineChartInstance: null,
      barChartInstance: null,
      timeList: [],
      chartData: {},
      fullScreenStatus: false
    }
  },
  methods: {
    initChart () {
      this.lineChartInstance = this.$echarts.init(this.$refs.line)
      this.barChartInstance = this.$echarts.init(this.$refs.bar)
    },
    getData () {
      this.timeList = [...new Set(this.cities.map(item => item.Time))]
      this.timeList.map(year => {
        this.chartData[year] = this.cities.filter(city => city.Time === year)
      })
      this.updateChart()
    },
    updateChart () {
      // 用不了这么多循环，可以优化
      const tmp = this.chartData[2018].sort((a, b) => a.Value - b.Value)
      const yData1Line = tmp.map(item => +item.Value.toFixed(2))
      const xData = tmp.map(item => item.CityName1.slice(0, 2) + '\n' + item.CityName2.slice(0, 2))
      const yData2Line = []
      let migration = []
      xData.forEach(item => {
        yData2Line.push(+this.chartData[2019].filter(
          d => d.CityName1.slice(0, 2) + '\n' + d.CityName2.slice(0, 2) === item || d.CityName2.slice(0, 2) + '\n' + d.CityName1.slice(0, 2) === item
        )[0].Value.toFixed(2))
        migration.push(+this.migration.filter(
          d => d.CityName1.slice(0, 2) + '\n' + d.CityName2.slice(0, 2) === item || d.CityName2.slice(0, 2) + '\n' + d.CityName1.slice(0, 2) === item
        )[0].Value)
      })
      const yData1Sum = yData1Line.reduce((preValue, currentValue) => preValue + currentValue, 0)
      const yData2Sum = yData2Line.reduce((preValue, currentValue) => preValue + currentValue, 0)
      const migrationSum = migration.reduce((preValue, currentValue) => preValue + currentValue, 0)
      const yData1Bar = yData1Line.map(item => +(item / yData1Sum).toFixed(2))
      const yData2Bar = yData2Line.map(item => +(item / yData2Sum).toFixed(2))
      migration = migration.map(item => +(item / migrationSum).toFixed(3))
      const lineOption = {
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        title: {
          text: this.chartTitle,
          textStyle: {
            color: '#C0C4CC'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['2018', '2019'],
          top: 30,
          right: 0,
          textStyle: {
            color: '#fft'
          }
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   },
        //   right: 15
        // },
        grid: {
          left: '1%',
          right: '1%',
          bottom: '2%',
          containLabel: true
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
          data: xData
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: 'rgba(255,255,255,.6)',
              fontSize: '12'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            }
          }
        ],
        series: [
          {
            name: '2018',
            type: 'line',
            lineStyle: {
              width: 1
            },
            showSymbol: false,
            emphasis: {
              focus: 'series'
            },
            data: yData1Line
          },
          {
            name: '2019',
            type: 'line',
            // stack: '总量',
            smooth: false,
            lineStyle: {
              width: 1
            },
            showSymbol: false,
            // areaStyle: {
            //   opacity: 0.8,
            //   color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //     offset: 0,
            //     color: 'rgba(0, 221, 255)'
            //   }, {
            //     offset: 1,
            //     color: 'rgba(77, 119, 255)'
            //   }])
            // },
            emphasis: {
              focus: 'series'
            },
            data: yData2Line
          }
        ]
      }
      const barOption = {
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        title: {
          text: this.chartTitle,
          textStyle: {
            color: '#C0C4CC'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          // data: ['2018', '2019'],
          top: 30,
          right: 0,
          itemHeight: 10,
          textStyle: {
            color: '#fft'
          }
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   },
        //   right: 15
        // },
        grid: {
          left: '1%',
          right: '1%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisLabel: {
            color: 'rgba(255,255,255,.6)',
            fontSize: '12'
          },
          axisLine: {
            show: false
          },
          data: xData.map(item => {
            return item.replace('-', '\n')
          })
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: 'rgba(255,255,255,.6)',
            fontSize: '12'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1)'
            }
          }
        },
        series: [
          {
            name: '2018',
            type: 'bar',
            data: yData1Bar,
            itemStyle: {
              borderRadius: [5, 5, 0, 0]
            },
            barMaxWidth: 10
          },
          {
            name: '2019',
            type: 'bar',
            itemStyle: {
              borderRadius: [5, 5, 0, 0]
            },
            barMaxWidth: 10,
            data: yData2Bar
          },
          {
            name: '人口迁徙',
            type: 'bar',
            itemStyle: {
              borderRadius: [5, 5, 0, 0]
            },
            barMaxWidth: 10,
            data: migration
          }
        ]
      }
      this.lineChartInstance.setOption(lineOption)
      this.barChartInstance.setOption(barOption)
    },
    changeSize () {
      this.fullScreenStatus = !this.fullScreenStatus
      this.$nextTick(() => {
        this.screenAdapter()
      })
    },
    screenAdapter () {
      this.lineChartInstance.resize()
      this.barChartInstance.resize()
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    this.$nextTick(() => {
      this.screenAdapter()
    })
    window.addEventListener('resize', this.screenAdapter)
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
.fullscreen {
  position: fixed!important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  background-color: #212733 !important;
  z-index: 100;
}
.panel {
  position: relative;
  flex: 1;
  border: 1px solid rgba(25, 186, 139, 0.17); /*no*/
  background: rgba(255, 255, 255, 0.04) url('~assets/bg/line(1).png');
  padding: 0 15px 0px;
  margin-bottom: 10px;
}
.panel::before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 10px; /*no*/
  height: 10px; /*no*/
  border-top: 2px solid #02a6b5; /*no*/
  border-left: 2px solid #02a6b5; /*no*/
}
.panel::after {
  position: absolute;
  top: 0;
  right: 0;
  content: "";
  width: 10px; /*no*/
  height: 10px; /*no*/
  border-top: 2px solid #02a6b5; /*no*/
  border-right: 2px solid #02a6b5; /*no*/
}
.panel-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
.panel-footer::before {
  position: absolute;
  bottom: 0;
  left: 0;
  content: "";
  width: 10px; /*no*/
  height: 10px; /*no*/
  border-bottom: 2px solid #02a6b5; /*no*/
  border-left: 2px solid #02a6b5; /*no*/
}
.panel-footer::after {
  position: absolute;
  bottom: 0;
  right: 0;
  content: "";
  width: 10px; /*no*/
  height: 10px; /*no*/
  border-bottom: 2px solid #02a6b5; /*no*/
  border-right: 2px solid #02a6b5; /*no*/
}
.el-carousel,
.el-carousel__item,
.panel-content {
  width: 100%;
  height: 100%;
}
.resize {
  position: absolute;
  top: 8px;/*no*/
  right: 12px;/*no*/
  z-index: 10;
}
.resize span {
  /*display: inline-block;*/
  font-size: 15px;/*no*/
  color: rgb(102,102,102);
}
.resize:hover {
  cursor: pointer;
}
</style>
