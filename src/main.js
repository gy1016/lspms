import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'assets/font/iconfont.css'
import '@/styles/index.scss'
import 'lib-flexible'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as echarts from 'echarts'

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
