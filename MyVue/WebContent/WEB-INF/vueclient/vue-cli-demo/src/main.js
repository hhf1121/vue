// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'// 引入ElementUI
import 'element-ui/lib/theme-chalk/index.css'// ElementUI组件需要手动引入样式
import axios from 'axios'
// 设置axios超时：
Vue.prototype.$http = axios.create({
  timeout: 10 * 1000
})
Vue.config.productionTip = false

Vue.use(ElementUI)// 在所有的vue文件中，都可使用

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
