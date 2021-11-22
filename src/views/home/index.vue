<template>
  <div id="app-main-home">
    <div class="home-list column">
      <div class="home-list-title">| 指标如下：
        <el-select
          v-model="listQuery.IndexType"
          style="width: 150px;"
          placeholder="分类"
          learable
          class="filter-item"
          @change="getFactorList(listQuery)"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.IndexType"
            :label="item.label + ' (' + item.num + ')'"
            :value="item.IndexType"
          />
        </el-select>
      </div>
      <div class="home-list-content">
        <list-panel v-for="item in factorList"
                    :key="item.id"
                    :factor="item"
                    :select-type="$store.state.global.currentIndex===item.id?'primary':''"
        >
        </list-panel>
      </div>
    </div>
    <div class="home-chart column">
<!--      <div :class="['home-chart-switch',$store.state.global.planVisual ? 'plan-visual' : '']">-->
<!--        <el-switch-->
<!--          v-if="factorList.length && categoryList.length"-->
<!--          v-model="planSwitch"-->
<!--          :width="25"-->
<!--          active-text="规划">-->
<!--        </el-switch>-->
<!--      </div>-->
      <div class="radio-group" style="z-index: 10">
        <el-radio-group v-model="radio" size="mini">
          <el-radio-button label="市级"></el-radio-button>
          <el-radio-button label="县级"></el-radio-button>
          <el-radio-button label="规划"></el-radio-button>
        </el-radio-group>
      </div>
<!--      <div class="home-chart-legend"></div>-->
      <map-chart v-if="radio === '市级'"/>
      <map-chart-plan  v-else-if="radio === '县级'"/>
      <map-chart-three v-else />
    </div>
  </div>
</template>

<script>
import ListPanel from '@/views/home/components/ListPanel'
import MapChart from '@/views/home/components/MapChart'
import MapChartPlan from '@/views/home/components/MapChartPlan'
import MapChartThree from '@/views/home/components/MapChartThree'
import { fetchList, getCategory } from '@/network/factor'

export default {
  name: 'Home',
  components: {
    MapChartThree,
    ListPanel,
    MapChart,
    MapChartPlan
  },
  data () {
    return {
      planSwitch: false,
      factorList: [],
      categoryList: [],
      listQuery: {
        from: 'home'
      },
      radio: '市级'
    }
  },
  created () {
    this.getFactorList(this.listQuery)
    this.getCategoryList()
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.planVisual = !this.planVisual
    // })
  },
  methods: {
    async getFactorList (query) {
      const res = await fetchList(query)
      this.factorList = res.data
      this.$store.commit('global/initFactorList', this.factorList)
      this.$store.commit('global/initCurrentIndexName')
    },
    async getCategoryList () {
      const res = await getCategory()
      this.categoryList = res.data
      this.$store.commit('global/initFactorCategory', this.categoryList)
    }
  }
}
</script>

<style scoped>
/*.plan-visual {*/
/*  display: block !important;*/
/*}*/
</style>
