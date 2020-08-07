import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 检测其它路径
  {
    path: '/',
    redirect: '/login'
  },
  // 登录
  {
    path: '/login',
    component: () => import('@/views/Login/index.vue'),
  },
  // home主页
  {
    path: '/home',
    component: () => import('@/views/Home/index.vue'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next();
  const tokenStr = window.sessionStorage.getItem('loginToken');
  if (!tokenStr) return next('/login'); // 没有token就跳转登录页
  next(); // 有就通过
})


export default router
