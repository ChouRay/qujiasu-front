import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/package',
    name: 'Package',
    component: () => import('@/views/Package.vue'),
    meta: { title: '套餐购买' }
  },
  {
    path: '/download',
    name: 'Download',
    component: () => import('@/views/Download.vue'),
    meta: { title: '软件下载' }
  },
  {
    path: '/agent',
    name: 'Agent',
    component: () => import('@/views/Agent.vue'),
    meta: { title: '代理加盟' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/center',
    name: 'Center',
    component: () => import('@/views/Center/Layout.vue'),
    meta: { title: '我的中心' },
    children: [
      {
        path: '',
        name: 'CenterIndex',
        component: () => import('@/views/Center/Index.vue'),
        meta: { title: '我的中心' }
      },
      {
        path: 'buy',
        name: 'Buy',
        component: () => import('@/views/Center/Buy.vue'),
        meta: { title: '套餐购买' }
      },
      {
        path: 'orders',
        name: 'CenterOrders',
        component: () => import('@/views/Center/Orders.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'recharge',
        name: 'CenterRecharge',
        component: () => import('@/views/Center/Recharge.vue'),
        meta: { title: '账户充值' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 需要登录才能访问的路由
const requireAuthPaths = ['/center']

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 趣加速`
  }
  
  // 检查是否需要登录
  const token = localStorage.getItem('token')
  const isAuthRequired = requireAuthPaths.some(path => to.path.startsWith(path))
  
  if (isAuthRequired && !token) {
    // 未登录，跳转到登录页，携带原路径
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
