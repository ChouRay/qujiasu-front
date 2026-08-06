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
    path: '/software',
    name: 'Software',
    component: () => import('@/views/Software.vue'),
    meta: { title: '软件下载' }
  },
  {
    path: '/agent',
    name: 'Agent',
    component: () => import('@/views/Agent.vue'),
    meta: { title: '代理加盟' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 趣加速`
  }
  next()
})

export default router
