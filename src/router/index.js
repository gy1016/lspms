import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'Home',
        meta: { title: '首页' }
      },
      {
        path: 'factor',
        component: () => import('@/views/factor/index'),
        name: 'Factor',
        meta: { title: '指标' }
      },
      {
        path: 'trend',
        component: () => import('@/views/trend/index'),
        name: 'Trend',
        meta: { title: '趋势' }
      },
      {
        path: 'model',
        component: () => import('@/views/model/index'),
        name: 'Model',
        meta: { title: '模型' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
