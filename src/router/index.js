import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 检测其它路径
  {
    path: '*',
    redirect: '/login'
  },
  // 登录
  {
    path: '/login',
    component: () => import('@/views/Login/index.vue'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
