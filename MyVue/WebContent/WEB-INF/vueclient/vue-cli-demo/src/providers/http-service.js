import axios from 'axios'
import rootVm from '../main.js'

axios.defaults.timeout = 5000
axios.defaults.baseURL = '' //填写域名//http request 拦截器
axios.interceptors.request.use(config => {
    config.data = JSON.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/json'
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
        console.log('未授权，请重新登录')
        rootVm.$message.error({message: '未登录，请重新登录', center: true})
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
  downUser: paramObj => get('/api/springBoot/downUser', paramObj),
  getAllNote: paramObj => get('/api/note/getAll', paramObj),
  getVerifyCode: paramObj => get('/api/springBoot/verifyCode', paramObj),//验证码
  getSelectDistrictByLevel: paramObj => get('/api/base/getSelectDistrictByLevel', paramObj),//验证码
  loadingPhoto: paramObj => post('/api/springBoot/loadingPhoto', paramObj),//验证码
  updateNoImg: paramObj => post('/api/springBoot/updateNoImg', paramObj),//更新用户
  checkTitle: paramObj => get('/api/note/checkTitle', paramObj),//校验标题唯一
  checkUserName: paramObj => get('/api/springBoot/checkUserName', paramObj),//注册时、校验用户名
  registerUser: paramObj => post('/api/springBoot/registerUser', paramObj),//注册时、校验用户名
  sendAdmin: paramObj => get('/api/springBoot/sendAdmin', paramObj),//普通用户申请权限
}
