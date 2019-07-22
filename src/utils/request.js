import axios from 'axios'
import store from '@/store'
import JSONbig from 'json-bigint'
import router from 'vue-router'
import { Toast } from 'vant'

const requestRefreshToken = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

const request = axios.create({
  // ��������ַ
  baseURL: 'http://ttapi.research.itcast.cn/'
})
// ��Ӧ������
request.defaults.transformResponse = [function (data) {
  try {
    return JSONbig.parse(data)
  } catch (err) {
    return data
  }
}]
// ����������
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// ��Ӧ������
request.interceptors.response.use(function (response) {
  return response.data.data || response.data
}, async function (error) {
  if (error.response && error.response.status === 401) {
    const { user } = store.state
    if (!user) {
      return router.push({ name: 'login' })
    }
    try {
      const res = await requestRefreshToken({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      store.commit("setUser", {
        token: res.data.data.token,
        refresh_token: user.refresh_token
      })
      console.log(store.state.user.token)
      return request(error.config)
    } catch (err) {
      return router.push('/login')
    }
  }
  return Promise.reject(error)
})

export default request
