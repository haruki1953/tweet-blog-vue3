import axios from 'axios'
import { axiosConfig } from '@/config'
import { useAuthStore } from '@/stores'
import router from '@/router'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL: axiosConfig.baseUrl,
  timeout: axiosConfig.timeout
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 携带token
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = authStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 4. 摘取核心响应数据
    // 204 响应表示请求成功但无内容
    if (res.status === 204 || res.data.code === 0) {
      return res
    }
    // TODO 3. 处理业务失败
    // 处理业务失败, 给错误提示，抛出错误
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误（本项目不需要）
    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if (err.response?.status === 401) {
      router.push('/login')
    }

    // 错误的默认情况 => 只要给提示
    ElMessage.error(err.response?.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance