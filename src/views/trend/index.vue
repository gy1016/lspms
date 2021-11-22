<template>
  <div id="app-main-trend">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="行政分区" name="admin"><admin-trend/></el-tab-pane>
      <el-tab-pane label="规划分区" name="plan"><plan-trend/></el-tab-pane>
      <el-tab-pane label="模型分析" name="model"><model-trend/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AdminTrend from '@/views/trend/components/AdminTrend'
import PlanTrend from '@/views/trend/components/PlanTrend'
import ModelTrend from '@/views/trend/components/ModelTrend'

export default {
  name: 'index',
  components: {
    AdminTrend,
    PlanTrend,
    ModelTrend
  },
  data () {
    return {
      activeName: 'admin'
    }
  },
  methods: {
    handleClick (tab, event) {
    }
  }
}
</script>

<style scoped>
.el-tabs {
  margin: 0px 15px;
}
</style>
