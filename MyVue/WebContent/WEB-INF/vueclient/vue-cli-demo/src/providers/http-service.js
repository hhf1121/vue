import axios from 'axios'
import rootVm from '../main.js'

axios.defaults.timeout = 5000
axios.defaults.baseURL = '' //填写域名//http request 拦截器

axios.interceptors.request.use(config => {
    const userJson=sessionStorage.getItem('user');
    const user=userJson?JSON.parse(userJson):"";
    // console.info(user,"http.user.........");
    config.data = JSON.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/json' ,
      'authToken':user.id!=undefined?user.token:""
    }
    return config
  },
  error => {
    return Promise.reject(err)
  }
)

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
  return response
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        console.log('错误请求')
        break
      case 401:
        // console.log('未授权，请重新登录')
        // rootVm.$message.error({message: '未登录，请重新登录', center: true})
        rootVm.$router.push({path:'/'})
        break
      case 403:
        console.log('拒绝访问')
        break
      case 404:
        console.log('请求错误,未找到该资源')
        break
      case 405:
        console.log('请求方法未允许')
        break
      case 408:
        console.log('请求超时')
        break
      case 500:
        console.log('服务器端出错')
        break
      case 501:
        console.log('网络未实现')
        break
      case 502:
        console.log('网络错误')
        break
      case 503:
        console.log('服务不可用')
        break
      case 504:
        console.log('网络超时')
        break
      case 505:
        console.log('http版本不支持该请求')
        break
      default:
        console.log(`连接错误${err.response.status}`)
    }
  } else {
    console.log('连接到服务器失败')
  }
  return Promise.resolve(err.response)
})

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

export const server = {
  login: paramObj => get('/api/springBoot/vue/queryByVue', paramObj),//登录
  queryPage: paramObj => post('/api/springBoot/user/queryPage', paramObj),
  deleteById: paramObj => get('api/springBoot/vue/deleteByVue', paramObj),
  createUser: paramObj => post('/api/springBoot/vue/insertDataByVue', paramObj),
  updateUser: paramObj => post('/api/springBoot/vue/updateDataByVue', paramObj),
  queryPageNotes: paramObj => post('/api/note/queryNoteLits', paramObj),
  queryNotesTitle: paramObj => get('/api/note/queryNotesTitle', paramObj),
  queryNotesWithPhoto: paramObj => get('/api/note/queryNoteLitsWithPohot', paramObj),
  updateNote: paramObj => post('/api/note/updateNote', paramObj),
  updateNoteAll: paramObj => post('/api/note/updateNoteAll', paramObj),
  deleteNote: paramObj => post('/api/note/deleteNotes', paramObj),
  createNote: paramObj => post('/api/note/createNote', paramObj),
  getCurrentUser: paramObj => get('/api/springBoot/getCurrentUser', paramObj),
  currentIsLogin: paramObj => get('/api/springBoot/currentIsLogin', paramObj),
  downUser: paramObj => get('/api/springBoot/downUser', paramObj),
  getAllNote: paramObj => get('/api/note/getAll', paramObj),
  getVerifyCode: paramObj => get('/api/springBoot/verifyCode', paramObj),//验证码
  getSelectDistrictByLevel: paramObj => get('/api/base/getSelectDistrictByLevel', paramObj),//查询行政信息
  getDistrictByCode: paramObj => get('/api/base/getDistrictByCode', paramObj),//根据父级查询一级子级的行政信息
  loadingPhoto: paramObj => post('/api/springBoot/loadingPhoto', paramObj),//验证码
  updateNoImg: paramObj => post('/api/springBoot/updateNoImg', paramObj),//更新用户
  checkTitle: paramObj => get('/api/note/checkTitle', paramObj),//校验标题唯一
  checkUserName: paramObj => get('/api/springBoot/checkUserName', paramObj),//注册时、校验用户名
  registerUser: paramObj => post('/api/springBoot/registerUser', paramObj),//注册时、校验用户名
  sendAdmin: paramObj => get('/api/springBoot/sendAdmin', paramObj),//普通用户申请权限
  getMsg: paramObj => post('/api/msg/getMsg', paramObj),//消息
  getMsgCount: paramObj => get('/api/msg/getMsgCount', paramObj),//消息
  signRead: paramObj => post('/api/msg/signRead', paramObj),//标记已读
  deleteMsgs: paramObj => post('/api/msg/deleteMsgs', paramObj),//标记已读
  sendMsg: paramObj => post('/api/msg/sendMsg', paramObj),//用户互发信息(通过mq，未读转储到redis，标记后储存mysql)
  sendDM: paramObj => post('/api/msg/sendDMAllWebSocket', paramObj),//弹幕系统
  sendAllWebSocket: paramObj => get('/api/msg/sendAllWebSocket', paramObj),//用户互发信息(通过mq，未读转储到redis，标记后储存mysql)
  //sendMsgByWebSocket: paramObj => post('/api/msg/sendOneWebSocket', paramObj),//用户互发信息(通过websocket)
  getDataByConfigCode: paramObj => get('/api/baseConfig/getDataByConfigCode', paramObj),//读取数据字典-基础配置
  saveConfig: paramObj => post('/api/baseConfig/saveConfig', paramObj),//花销类型-基础配置，保存
  saveBaseConfig:paramObj => post('/api/baseConfig/saveBaseConfig', paramObj),//基础字典，新增保存
  queryBaseConfig:paramObj => get('/api/baseConfig/queryBaseConfig', paramObj),//基础字典，查询类型
  checkedBaseConfig:paramObj => post('/api/baseConfig/checkedBaseConfig', paramObj),//基础字典，校验唯一
  deleteBaseConfig:paramObj => get('/api/baseConfig/deleteBaseConfig', paramObj),//基础字典，删除
  queryVip: paramObj => get('/api/springBoot/queryVip', paramObj),//查询vip
  getBrithdayImg: paramObj => get('/api/springBoot/getBrithdayImg', paramObj),//生成生日祝福的图片
  addGoods: paramObj => post('/api/sellGoods/saveGoods', paramObj),// 新增/更新商品
  managerGoods: paramObj => get('/api/sellGoods/queryGoods', paramObj),//管理商品
  showGoods: paramObj => post('/api/sellGoods/showGoods', paramObj),//展示商品
  updateStatusGoods: paramObj => post('/api/sellGoods/updateStatusGoods', paramObj),//商品状态
  addGoodsViews: paramObj => get('/api/sellGoods/addGoodsViews', paramObj),//商品浏览量
  queryWxPicture: paramObj => get('/api/login/code/getTicket', paramObj),//请求二维码
}
