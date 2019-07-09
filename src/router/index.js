import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    { name: 'home', path: '/', component: () => import('@/views/home') },
    { name: 'login', path: '/login', component: () => import('@/views/login') }
  ]
})

export default router
