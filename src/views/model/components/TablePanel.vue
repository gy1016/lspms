<template>
  <div :class="['panel table', fullScreenStatus ? 'fullscreen' : '']">
<!--    <div id="SGY"  ref="SGY" style="width: 800px;height: 800px;position: absolute;left: -500px;"></div>-->
    <h2>{{tableTitle}}</h2>
    <div class="resize">
      <span @click="changeSize" :class="['iconfont', fullScreenStatus ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
    </div>
    <div class="time-list">
      <ul>
        <li v-for="(year, index) in timeList"
            :key="index"
            :class="{selected:year===currentTime}"
            @click="changeYear(year)"
        >{{year}}</li>
      </ul>
    </div>
    <el-carousel indicator-position="none" :interval="5000" height="80%">
      <el-carousel-item :key="1">
        <div class="cities">
      <table>
        <tr v-for="row in tableData">
          <td v-for="data in row">
            <span v-if="data">
              {{ data | formatData }}
            </span>
            <span v-else>
              <pre>    </pre>
            </span>
          </td>
        </tr>
      </table>
    </div>
      </el-carousel-item>
      <el-carousel-item :key="2">
        <div class="cities" ref="pie">
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="panel-footer"></div>
  </div>
</template>

<script>
export default {
  name: 'TablePanel',
  props: {
    tableTitle: {
      type: String,
      required: true
    },
    cities: {
      type: Array,
      default () {
        return []
      },
      required: true
    }
  },
  data () {
    return {
      tableData: [],
      pieData: [],
      timeList: [],
      currentTime: null,
      chartInstance: null,
      fullScreenStatus: false
      // difInstance: null
    }
  },
  filters: {
    formatData (value) {
      if (typeof value === 'number') {
        if (value === 0) {
          return ''
        }
        return value.toFixed(0)
      }
      return value
    }
  },
  mounted () {
    this.timeList = [...new Set(this.cities.map(city => city.Time))].sort((a, b) => b - a)
    this.currentTime = this.timeList[0]
    this.tableData = this.getTableData(this.cities, this.currentTime)
    this.initChart()
    this.getPieData(this.cities, this.currentTime)
    // this.difChart()
    this.$nextTick(() => {
      this.screenAdapter()
    })
    window.addEventListener('resize', this.screenAdapter)
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.pie)
      // this.difInstance = this.$echarts.init(this.$refs.SGY)
    },
    // difChart () {
    //   const tmp2018 = this.getPieData2(this.cities, 2018)
    //   const tmp2019 = this.getPieData2(this.cities, 2019)
    //   const dif = tmp2019.map((d, i) => {
    //     const tmp = {
    //       name: '',
    //       value: 0
    //     }
    //     tmp.name = d.name
    //     tmp.value = Math.abs(d.value - tmp2018[i].value)
    //     return tmp
    //   })
    //   const pieOption = {
    //     title: {
    //       text: this.tableTitle + '时序差量占比图',
    //       textStyle: {
    //         color: '#C0C4CC'
    //       },
    //       left: 'center'
    //     },
    //     toolbox: {
    //       feature: {
    //         saveAsImage: {}
    //       }
    //     },
    //     series: [
    //       {
    //         name: '南丁格尔',
    //         type: 'pie',
    //         radius: ['5%', '70%'],
    //         center: ['50%', '50%'],
    //         roseType: 'radius',
    //         itemStyle: {
    //           borderRadius: 8
    //         },
    //         data: dif
    //       }
    //     ]
    //   }
    //   this.difInstance.setOption(pieOption)
    // },
    // getPieData2 (cities, year) {
    //   const res = []
    //   const filterCity = cities.filter(item => item.Time === year)
    //   filterCity.map(item => {
    //     const tmp = {
    //       name: '',
    //       value: null
    //     }
    //     tmp.name = item.CityName1.slice(0, 2) + '-' + item.CityName2.slice(0, 2)
    //     tmp.value = item.Value
    //     res.push(tmp)
    //   })
    //   return res
    // },
    getPieData (cities, year) {
      this.pieData = []
      const filterCity = cities.filter(item => item.Time === year)
      filterCity.map(item => {
        const tmp = {
          name: '',
          value: null
        }
        tmp.name = item.CityName1.slice(0, 2) + '-' + item.CityName2.slice(0, 2)
        tmp.value = item.Value
        this.pieData.push(tmp)
      })
      this.updateChart()
    },
    updateChart () {
      const pieOption = {
        // legend: {
        //   type: 'scroll',
        //   orient: 'vertical',
        //   right: 10,
        //   top: 20,
        //   bottom: 20
        // },
        series: [
          {
            name: '南丁格尔',
            type: 'pie',
            radius: ['5%', '70%'],
            center: ['50%', '50%'],
            roseType: 'radius',
            itemStyle: {
              borderRadius: 8
            },
            data: this.pieData
          }
        ]
      }
      this.chartInstance.setOption(pieOption)
    },
    screenAdapter () {
      this.chartInstance.resize()
    },
    getTableData (cities, year) {
      const tableData = []
      // 屎一样的代码
      const x = [...new Set(cities.map(city => city.CityName1.slice(0, 2)))]
      const y = [...new Set(cities.map(city => city.CityName2.slice(0, 2)))]
      const citiesName = [...new Set([...x, ...y])]
      citiesName.unshift(0)
      const n = citiesName.length
      for (let i = 0; i < n; i++) {
        if (i === 0) {
          tableData.push(citiesName)
          continue
        }
        tableData.push([citiesName[i]])
      }
      for (let i = 1; i < n; i++) {
        for (let j = i; j < n; j++) {
          if (i === j) {
            tableData[i][j] = '-'
          } else {
            // 循环这么多次，你是煞笔吧。算了，就这样。。。。
            tableData[i][j] = cities.filter(city => city.Time === year && city.CityName1.slice(0, 2) === tableData[i][0] && city.CityName2.slice(0, 2) === citiesName[j])[0].Value
            tableData[j][i] = tableData[i][j]
          }
        }
      }
      return tableData
    },
    changeYear (year) {
      if (year !== this.currentTime) {
        this.currentTime = year
        this.tableData = this.getTableData(this.cities, this.currentTime)
        this.getPieData(this.cities, this.currentTime)
      }
    },
    changeSize () {
      this.fullScreenStatus = !this.fullScreenStatus
      this.$nextTick(() => {
        this.screenAdapter()
      })
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
.fullscreen .el-carousel {
  height: 100% !important;
}
.fullscreen .el-carousel__container {
  height: 100% !important;
  position: relative !important;
}

.fullscreen table {
  position: absolute;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
.panel {
  position: relative;
  flex: 1;
  border: 1px solid rgba(25, 186, 139, 0.17); /*no*/
  /*background: rgba(255, 255, 255, 0.04) url('~assets/bg/line(1).png');*/
  padding: 0 15px 40px;
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
.panel h2 {
  height: 32px;
  color: #C0C4CC;
  line-height: 32px;
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  margin-top: 10px;
}

.time-list li {
  float: right;
  margin: 0 0 5px 10px;
  color: #C0C4CC;
}
.time-list li:hover {
  cursor: pointer;
}
.time-list li.selected{
  color: #53D9FF;
}

.cities {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  overflow:auto;
}
.cities::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 0px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
.cities::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius   : 10px;
  background-color: skyblue;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}
.cities::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  background   : #ededed;
  border-radius: 10px;
}

table {
  width: 100%;
  margin: 0 auto;
  border-collapse: collapse;
}
table, th, td {
  border: 1px solid rgba(25, 186, 139, 0.17);
}
th, td {
  text-align: center;
  padding: 8px;
  white-space:nowrap
}

.el-carousel,
.el-carousel__item {
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
