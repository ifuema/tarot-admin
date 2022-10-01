import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/userportrait',
    children: [
      {
        path: '/deck',
        name: 'Deck',
        component: ()=> import('@/views/Deck.vue')
      },
      {
        path: '/towermaster',
        name: 'TowerMaster',
        component: ()=> import('@/views/TowerMaster.vue')
      },
      {
        path: '/userportrait',
        name: 'UserPortrait',
        component: ()=> import('@/views/UserPortrait.vue')
      },
      {
        path: '/user/:id',
        name: 'User',
        component: ()=> import('@/views/User.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
