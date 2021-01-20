import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MyHome from '@/components/MyHome'
import Login from '@/view/Login'
import MyData from '@/view/TableData'
import MyVxeTable from '@/view/MyVxeTable'
import menu from '@/view/menu'
import User from '@/view/currentUser/currentUser'
import ChinaMap from '@/view/ChinaMap/map'
import china from '@/view/ChinaMap/china'
import about from '@/view/ChinaMap/about'
import MyMedia from '@/view/recreation/MyMedia'
import MyGame from '@/view/recreation/MyGame'

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
      path: '/MyData',
      name: 'MyData',
      component: MyData
    },
    {
      path: '/MyVxeTable',
      name: 'MyVxeTable',
      component: MyVxeTable
    },
    {
      path: '/MyMedia',
      name: 'MyMedia',
      component: MyMedia
    },
    {
      path: '/MyGame',
      name: 'MyGame',
      component: MyGame
    },
    {
      path: '/register',
      name: 'register',
      component: () =>import('@/view/registerUser')
    },
    {
      path: '/ChinaMap',
      name: 'ChinaMap',
      component: ChinaMap,
      children: [
        {
          path: 'china',//以“/”开头的嵌套路径会被当作根路径，所以子路由上不用加“/”;
          name: 'china',// 在生成路由时，主路由上的path会被自动添加到子路由之前，所以子路由上的path不用在重新声明主路由上的path了。
          component: china
        },
        {
          path: 'about',
          name: 'about',
          component: about
        }
      ]
    },
  ]
})
