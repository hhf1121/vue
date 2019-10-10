import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MyHome from '@/components/MyHome'
import Login from '@/view/Login'
import Down from '@/view/Down'
import MyData from '@/view/TableData'

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
      path: '/Down',
      name: 'Down',
      component: Down
    },
    {
      path: '/MyData',
      name: 'MyData',
      component: MyData
    }
  ]
})
