import axios from 'axios'

const service = axios.create({
  // baseURL: 'http://1.116.139.25:3000/api',
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    // 如果存在 token 则附带在 http header 中
    // if (store.getters.token) {
    //   config.headers['Authorization'] = `Bearer ${getToken()}`
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  error => {
    console.log(error)
  }
)

export default service
