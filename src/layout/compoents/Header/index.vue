<template>
 <div id="app-header">
   <div class="header-func">
     <header-item path="/home">
       <img src="~assets/icon/home.svg" alt="首页">
       <div class="icon-item-text">首页</div>
     </header-item>
     <header-item path="/factor">
       <img src="~assets/icon/factor.svg" alt="指标管理">
       <div class="icon-item-text">指标管理</div>
     </header-item>
     <header-item path="/trend">
       <img src="~assets/icon/trend.svg" alt="趋势分析">
       <div class="icon-item-text">趋势分析</div>
     </header-item>
     <header-item path="/model">
       <img src="~assets/icon/model.svg" alt="专题模型">
       <div class="icon-item-text">专题模型</div>
     </header-item>
   </div>
   <div class="header-title"><h1>湖北省国土空间规划监测评估预警系统</h1></div>
   <div class="header-time">{{ '当前时间：' + dateFormat(currentTime) }}</div>
 </div>
</template>

<script>
import HeaderItem from '@/layout/compoents/Header/HeaderItem'
import { dateFormat } from '@/utils/index'

export default {
  name: 'Header',
  components: {
    HeaderItem
  },
  data () {
    return {
      currentTime: new Date()
    }
  },
  methods: {
    dateFormat
  },
  mounted () {
    const that = this
    this.timer = setInterval(function () {
      that.currentTime = new Date().toLocaleString()
    }, 1000)
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped>

</style>
