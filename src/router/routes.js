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
    redirect: '/welcome', // 重定向
    children: [{
        path: '/welcome',
        component: () => import('@/components/Welcome.vue')
      },
      // 用户列表
      {
        path: '/users',
        component: () => import('@/views/Home/User/User.vue')
      },
      // 角色列表
      {
        path: '/roles',
        component: () => import('@/views/Home/Role/Role.vue')
      },
      // 权限列表
      {
        path: '/rights',
        component: () => import('@/views/Home/Role/Right.vue')
      },
      // 商品列表
      {
        path: '/goods',
        component: () => import('@/views/Home/Shop/List.vue')
      },
      // 参数
      {
        path: '/params',
        component: () => import('@/views/Home/Shop/Params.vue')
      },
      // 分类
      {
        path: '/categories',
        component: () => import('@/views/Home/Shop/Cate.vue')
      },
      // 订单列表
      {
        path: '/orders',
        component: () => import('@/views/Home/Order/Order.vue')
      },
      // 数据统计
      {
        path: '/reports',
        component: () => import('@/views/Home/Report/Report.vue')
      },
    ]
  }
]

export default routes
