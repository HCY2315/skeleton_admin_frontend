import axios from 'axios'
// import store from '@/store'
import {getToken, setToken,removeToken} from '@/libs/util'
import router from '../router'
import config from '../router'
import {Message} from 'iview'

let message = null

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    }
    return config
  }

  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 接口请求增加token
      config.headers.Authorization = 'Bearer ' + getToken()
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const {data, status} = res
      return {data, status}
    }, error => {
      this.destroy(url)
      if (error == "Error: Network Error") {
        setToken('')
        if (message === null) {
          message = Message.info({
            content: '后端服务未启动',
            duration: 3,
            closable: true,
            onClose: () => {
              message = null
            },
          })
        }
        router.push({
          name: config.homeName
        }).catch(() => {
        })
      }

      let errorInfo = error.response
      if (errorInfo.data.code == 401) {
        setToken('')
        router.push({
          name: config.homeName
        }).catch(() => {
        })
      }
      if (errorInfo.data.code == 405 && url == "/users/info") {     
        removeToken()
        Message.info({
          content: '请联系管理员分配用户权限',
          duration: 3,
          closable: true
        })
        setTimeout(() => {
          location.reload()
        }, 1000);
        

      }
      
      if (!errorInfo) {
        const {request: {statusText, status}, config} = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: {responseURL: config.url}
        }
      }
      return Promise.reject(errorInfo)
    })
  }

  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
