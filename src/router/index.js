import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由
import routes from './routes.js'

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next();
  const tokenStr = window.sessionStorage.getItem('loginToken');
  if (!tokenStr) return next('/login'); // 没有token就跳转登录页
  next(); // 有就通过
})


export default router
