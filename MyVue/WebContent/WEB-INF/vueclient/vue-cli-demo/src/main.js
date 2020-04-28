// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'// 引入ElementUI
import 'element-ui/lib/theme-chalk/index.css'// ElementUI组件需要手动引入样式
import D2Crud from '@d2-projects/d2-crud' // 引入d2crud组件
import VCharts from 'v-charts' // 引入
import axios from 'axios'

import {server} from './providers/http-service'

import {NoteType} from './database/notetype'
import {User} from './view/currentUser/currentUser'
import VueJsonp from 'vue-jsonp'

Vue.prototype.NoteType = NoteType
Vue.prototype.$USER = User
const Base64 = require('js-base64').Base64

//定义全局变量
Vue.prototype.$api=server;
// 设置axios超时：
Vue.prototype.$http = axios.create({
  timeout: 10 * 1000
})
Vue.config.productionTip = false

Vue.use(ElementUI)// 在所有的vue文件中，都可使用
Vue.use(D2Crud)
Vue.use(VCharts)
Vue.use(VueJsonp)


//高亮directive
Vue.directive('highlight', function (el, binding, vnode) {
  console.log(el)
  console.log(binding.value)
  //创建span
  // const spanDom = document.createElement('span');
  // spanDom.innerHTML = binding.value;
  // spanDom.style.color = '#ff6600';
  //获取span
  const elSpan = el.querySelector('span');
  //获取text文本
  const text = elSpan.innerText;
  //替换文本
  const newText=text.replace(binding.value, "<span style='color: red'>"+binding.value+"</span>");
  //改变span的html
  elSpan.innerHTML = newText;
  //添加span标签
  el.appendChild(elSpan)
})

/* eslint-disable no-new */
let rootVm=new Vue({
  el: '#app',
  Base64,
  data: function(){
    return {
      USER: {},
    }
  },
  render: h => h(App),
  router,
  components: { App },
  template: '<App/>'
}).$mount('#app');
//导入rootVm、供axios使用。实现未登录跳转。
export default rootVm
