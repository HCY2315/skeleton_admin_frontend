import HttpRequest from '@/libs/axios'
import config from '@/config'
import Qs from 'qs'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
const captchaUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev_captcha : config.baseUrl.pro_captcha
const httpClient = new HttpRequest(baseUrl)
const captchaClient = new HttpRequest(captchaUrl)

export default {
  name: "axios",
  get(request_uri, params) {
    return httpClient.request({
      url: request_uri,
      method: 'get',
      params: params,
      timeout: 5000
    })
  },
  post(request_uri, form_data) {
    return httpClient.request({
      url: request_uri,
      method: 'post',
      data: Qs.stringify(form_data),
      timeout: 5000
    })
  },
  // 提交原生 json 格式数据，以 post 方式提交数据（服务端需要允许post方式提交的raw json ），get 方式在 axios 中有问题
  raw_post(request_uri, json) {
    return httpClient.request({
      //baseURL: '',   //  将前缀设置为空，request_uri 参数可以指定任何站点的完整地址
      url: request_uri,
      method: 'post',
      data: json,
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 5000
    })
  },

  // 更多请求方式请自行封装即可
  //验证码
  captchaGet(request_uri, params) {
    return captchaClient.request({
      url: request_uri,
      method: 'get',
      params: params
    })
  },

  captchaImgGet(request_uri, params) {
    return captchaClient.request({
      url: request_uri,
      method: 'get',
      params: params,
      responseType: 'arraybuffer'
    })
  },
}
