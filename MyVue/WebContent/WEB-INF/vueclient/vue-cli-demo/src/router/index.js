import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MyHome from '@/components/MyHome'
import Login from '@/view/Login'
import Down from '@/view/Down'
import MyData from '@/view/TableData'
import D2Table from '@/view/D2Table'
import menu from '@/view/menu'
import User from '@/view/currentUser/currentUser'
// import ChinaMap from '@/view/ChinaMap/map'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/Login'
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/home',
      name: 'MyHome',
      component: MyHome
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/menu',
      name: 'menu',
      component: menu
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/Down',
      name: 'Down',
      component: Down
    },
    {
      path: '/MyData',
      name: 'MyData',
      component: MyData
    },
    {
      path: '/D2Table',
      name: 'D2Table',
      component: D2Table
    },
    // {
    //   path: '/ChinaMap',
    //   name: 'ChinaMap',
    //   component: ChinaMap
    // },
  ]
})
