<template>
  <div class="panel">
    <div class="panel-content">
      <span :title="factor.IndexName">{{ factor.id + '. ' + factor.IndexName }}</span>
      <el-button
        icon="el-icon-view"
        :type="selectType"
        style="float: right"
        size="mini"
        circle
        @click="changeIndex(factor.id)"
      ></el-button>
    </div>
    <div class="panel-footer"></div>
  </div>
</template>

<script>
import { fetchValue } from '@/network/value'

export default {
  name: 'ListPanel',
  props: {
    factor: {
      type: Object,
      default () {
        return {
          id: 99,
          IndexName: 'haha'
        }
      }
    },
    selectType: {
      type: String,
      default: ''
    }
  },
  methods: {
    async changeIndex (index) {
      if (index === this.$store.state.global.currentIndex) {
        this.$message({
          message: '已在当前指标',
          type: 'success'
        })
      } else {
        const { code, data } = await fetchValue({ id: index })
        if (code !== 1) {
          this.$message('指标请求超时，请稍后再试！')
        }
        // []不是false
        if (data.length) {
          this.$store.commit('global/alterIndex', index)
          this.$store.commit('data/initValueList', data)
          this.$store.commit('data/initTimeList')
          this.$store.commit('data/initMapData')
          this.$store.commit('data/initThreeData')
        } else {
          this.$message('指标未计算！')
        }
      }
    }
  }
}
</script>

<style scoped>
.panel {
  position: relative;
  height: 50px;
  border: 1px solid rgba(25, 186, 139, 0.17); /*no*/
  background: rgba(255, 255, 255, 0.04) url('~assets/bg/line(1).png');
  padding: 0 15px 0px;
  margin: 10px 10px 0.1875rem;
}
.panel::before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 10px; /*no*/
  height: 10px; /*no*/
  border-top: 1px solid #02a6b5; /*no*/
  border-left: 1px solid #02a6b5; /*no*/
}
.panel::after {
  position: absolute;
  top: 0;
  right: 0;
  content: "";
  width: 10px; /*no*/
  height: 10px; /*no*/
  border-top: 1px solid #02a6b5; /*no*/
  border-right: 1px solid #02a6b5; /*no*/
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
  border-bottom: 1px solid #02a6b5; /*no*/
  border-left: 1px solid #02a6b5; /*no*/
}
.panel-footer::after {
  position: absolute;
  bottom: 0;
  right: 0;
  content: "";
  width: 10px; /*no*/
  height: 10px; /*no*/
  border-bottom: 1px solid #02a6b5; /*no*/
  border-right: 1px solid #02a6b5; /*no*/
}
.panel-content span {
  height: 48px;
  width: 250px;
  color: #fff;
  line-height: 48px;
  text-align: left;
  font-size: 15px;
  font-weight: 400;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-button{
  margin-top: 5px;
}
</style>
