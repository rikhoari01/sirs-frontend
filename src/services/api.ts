import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { API_BASE_URL } from '@/env'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use(config => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
    }
    return Promise.reject(err)
  }
)

export default api
