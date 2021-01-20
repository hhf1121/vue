// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

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


import VueDPlayer from 'vue-dplayer';
import 'vue-dplayer/dist/vue-dplayer.css';

Vue.use(VueDPlayer);


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
Vue.use(VXETable);
//自定义-高亮directive
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
});
//自定义-对话框拖拽
// v-dialogDrag: 弹窗拖拽
// directives.js
// v-dialogDrag: 弹窗拖拽
// Vue.directive('dialogDrag', {
//   bind(el, binding, vnode, oldVnode) {
//     // 获取拖拽内容头部
//     const dialogHeaderEl = el.querySelector('.el-dialog__header');
//     // 获取拖拽内容整体 这个rrc-dialog是我自己封装的组件 如果使用element的组件应写成.el-dialog
//     const dragDom = el.querySelector('.rrc-dialog');
//     dialogHeaderEl.style.cursor = 'move';
//
//     // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
//     const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
//
//     // 鼠标按下事件
//     dialogHeaderEl.onmousedown = (e) => {
//       // 鼠标按下，计算当前元素距离可视区的距离 (鼠标点击位置距离可视窗口的距离)
//       const disX = e.clientX - dialogHeaderEl.offsetLeft;
//       const disY = e.clientY - dialogHeaderEl.offsetTop;
//
//       // 获取到的值带px 正则匹配替换
//       let styL, styT;
//
//       // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
//       if (sty.left.includes('%')) {
//         styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
//         styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
//       } else {
//         styL = +sty.left.replace(/\px/g, '');
//         styT = +sty.top.replace(/\px/g, '');
//       };
//
//       // 鼠标拖拽事件
//       document.onmousemove = function (e) {
//         // 通过事件委托，计算移动的距离 （开始拖拽至结束拖拽的距离）
//         const l = e.clientX - disX;
//         const t = e.clientY - disY;
//
//         let finallyL = l + styL
//         let finallyT = t + styT
//
//         // 边界值判定 注意clientWidth scrollWidth区别 要减去之前的top left值
//         // dragDom.offsetParent表示弹窗阴影部分
//         if (finallyL < 0) {
//           finallyL = 0
//         } else if (finallyL > dragDom.offsetParent.clientWidth - dragDom.clientWidth - dragDom.offsetParent.offsetLeft) {
//           finallyL = dragDom.offsetParent.clientWidth - dragDom.clientWidth - dragDom.offsetParent.offsetLeft
//         }
//
//         if (finallyT < 0) {
//           finallyT = 0
//         } else if (finallyT > dragDom.offsetParent.clientHeight - dragDom.clientHeight - dragDom.offsetParent.offsetLeft) (
//           finallyT = dragDom.offsetParent.clientHeight - dragDom.clientHeight - dragDom.offsetParent.offsetLeft
//         )
//
//         // 移动当前元素
//         dragDom.style.left = `${finallyL}px`;
//         dragDom.style.top = `${finallyT}px`;
//
//         //将此时的位置传出去
//         //binding.value({x:e.pageX,y:e.pageY})
//       };
//
//       document.onmouseup = function (e) {
//         document.onmousemove = null;
//         document.onmouseup = null;
//       };
//     }
//   }
// });

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
