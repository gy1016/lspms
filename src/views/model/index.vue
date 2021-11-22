<template>
  <div id="app-main-model">
    <div class="model-list column">
      <chart-panel v-if="cities1.length"
                       :cities="cities1"
                        :migration="migration1"
                       chart-title="武汉1+8城市圈"
      />
      <chart-panel v-if="cities2.length"
                        :cities="cities2"
                        :migration="migration2"
                        chart-title="襄十随神城市群"
      />
      <chart-panel v-if="cities3.length"
                        :cities="cities3"
                        :migration="migration3"
                        chart-title="宜荆荆恩城市群"
      />
    </div>
    <map-chart v-if="correlationList.length" :correlation-list="correlationList"></map-chart>
    <div class="model-content column">
      <table-panel v-if="cities1.length"
                   :cities="cities1"
                   table-title="武汉1+8城市圈"
      />
      <table-panel v-if="cities2.length"
                   :cities="cities2"
                   table-title="襄十随神城市群"
      />
      <table-panel v-if="cities3.length"
                   :cities="cities3"
                   table-title="宜荆荆恩城市群"
      />
    </div>
  </div>
</template>

<script>
import MapChart from '@/views/model/components/MapChart'
import ChartPanel from '@/views/model/components/ChartPanel'
import TablePanel from '@/views/model/components/TablePanel'
import { fetchList } from '@/network/correlation'

export default {
  name: 'Model',
  components: {
    MapChart,
    ChartPanel,
    TablePanel
  },
  data () {
    return {
      correlationList: [],
      cities1: [],
      cities2: [],
      cities3: [],
      migration1: [
        {
          CityName1: '武汉市',
          CityName2: '黄石市',
          Value: '4.35'
        }, {
          CityName1: '武汉市',
          CityName2: '鄂州市',
          Value: '6.305'
        }, {
          CityName1: '武汉市',
          CityName2: '孝感市',
          Value: '12.865'
        }, {
          CityName1: '武汉市',
          CityName2: '黄冈市',
          Value: '11.325'
        }, {
          CityName1: '武汉市',
          CityName2: '咸宁市',
          Value: '5.345'
        }, {
          CityName1: '武汉市',
          CityName2: '仙桃市',
          Value: '2.475'
        }, {
          CityName1: '武汉市',
          CityName2: '潜江市',
          Value: '1.095'
        }, {
          CityName1: '武汉市',
          CityName2: '天门市',
          Value: '1.33'
        }, {
          CityName1: '黄石市',
          CityName2: '鄂州市',
          Value: '13.055'
        }, {
          CityName1: '黄石市',
          CityName2: '孝感市',
          Value: '0.63'
        }, {
          CityName1: '黄石市',
          CityName2: '黄冈市',
          Value: '6.895'
        }, {
          CityName1: '黄石市',
          CityName2: '咸宁市',
          Value: '2.24'
        }, {
          CityName1: '黄石市',
          CityName2: '仙桃市',
          Value: '0.175'
        }, {
          CityName1: '黄石市',
          CityName2: '潜江市',
          Value: '0.085'
        }, {
          CityName1: '黄石市',
          CityName2: '天门市',
          Value: '0.079'
        }, {
          CityName1: '鄂州市',
          CityName2: '孝感市',
          Value: '1.27'
        }, {
          CityName1: '鄂州市',
          CityName2: '黄冈市',
          Value: '8.64'
        }, {
          CityName1: '鄂州市',
          CityName2: '咸宁市',
          Value: '1.42'
        }, {
          CityName1: '鄂州市',
          CityName2: '仙桃市',
          Value: '0.24'
        }, {
          CityName1: '鄂州市',
          CityName2: '潜江市',
          Value: '0.135'
        }, {
          CityName1: '鄂州市',
          CityName2: '天门市',
          Value: '0.145'
        }, {
          CityName1: '孝感市',
          CityName2: '黄冈市',
          Value: '2.715'
        }, {
          CityName1: '孝感市',
          CityName2: '咸宁市',
          Value: '1'
        }, {
          CityName1: '孝感市',
          CityName2: '仙桃市',
          Value: '2.39'
        }, {
          CityName1: '孝感市',
          CityName2: '潜江市',
          Value: '0.59'
        }, {
          CityName1: '孝感市',
          CityName2: '天门市',
          Value: '2.14'
        }, {
          CityName1: '黄冈市',
          CityName2: '咸宁市',
          Value: '0.83'
        }, {
          CityName1: '黄冈市',
          CityName2: '仙桃市',
          Value: '0.26'
        }, {
          CityName1: '黄冈市',
          CityName2: '潜江市',
          Value: '0.18'
        }, {
          CityName1: '黄冈市',
          CityName2: '天门市',
          Value: '0.2'
        }, {
          CityName1: '咸宁市',
          CityName2: '仙桃市',
          Value: '0.68'
        }, {
          CityName1: '咸宁市',
          CityName2: '潜江市',
          Value: '0.26'
        }, {
          CityName1: '咸宁市',
          CityName2: '天门市',
          Value: '0.28'
        }, {
          CityName1: '仙桃市',
          CityName2: '潜江市',
          Value: '7.235'
        }, {
          CityName1: '仙桃市',
          CityName2: '天门市',
          Value: '10.14'
        }, {
          CityName1: '潜江市',
          CityName2: '天门市',
          Value: '4.31'
        }
      ],
      migration2: [
        {
          CityName1: '襄阳市',
          CityName2: '十堰市',
          Value: '12.41'
        }, {
          CityName1: '襄阳市',
          CityName2: '随州市',
          Value: '5.445'
        }, {
          CityName1: '襄阳市',
          CityName2: '神农架林区',
          Value: '0.645'
        }, {
          CityName1: '十堰市',
          CityName2: '随州市',
          Value: '1.625'
        }, {
          CityName1: '十堰市',
          CityName2: '神农架林区',
          Value: '1.45'
        }, {
          CityName1: '随州市',
          CityName2: '神农架林区',
          Value: '0.03'
        }
      ],
      migration3: [
        {
          CityName1: '宜昌市',
          CityName2: '荆州市',
          Value: '14.695'
        }, {
          CityName1: '宜昌市',
          CityName2: '荆门市',
          Value: '5.515'
        }, {
          CityName1: '宜昌市',
          CityName2: '恩施土家族苗族自治州',
          Value: '10.52'
        }, {
          CityName1: '荆州市',
          CityName2: '荆门市',
          Value: '5.455'
        }, {
          CityName1: '荆州市',
          CityName2: '恩施土家族苗族自治州',
          Value: '1.515'
        }, {
          CityName1: '荆门市',
          CityName2: '恩施土家族苗族自治州',
          Value: '1.29'
        }
      ]
    }
  },
  created () {
    this.getData()
  },
  mounted () {
  },
  methods: {
    async getData () {
      const res = await fetchList({ From: 'model' })
      // console.log(res.data)
      const newRes = []
      for (let i = 0, n = res.data.length; i < n; i++) {
        if (this.isNotDuplicate(newRes, res.data[i])) {
          newRes.push(res.data[i])
        } else {
          continue
        }
      }
      this.correlationList = newRes
      // console.log(newRes)
      newRes.map(cor => {
        if (cor.Belong === 1) {
          this.cities1.push(cor)
        } else if (cor.Belong === 2) {
          this.cities2.push(cor)
        } else if (cor.Belong === 3) {
          this.cities3.push(cor)
        }
      })
    },
    isNotDuplicate (arr, obj) {
      if (!arr.length) { return true }
      for (let i = 0, n = arr.length; i < n; i++) {
        if (arr[i].CityName1 === obj.CityName2 && arr[i].CityName2 === obj.CityName1 ) {
          return false
        }
      }
      return true
    }
  }
}
</script>

<style scoped>
</style>
