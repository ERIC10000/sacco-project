import axios, { AxiosInstance, AxiosError } from 'axios'
import { ApiResponse } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const api = {
  get: <T>(url: string, config?: any) =>
    apiClient.get<ApiResponse<T>>(url, config),
  post: <T>(url: string, data?: any, config?: any) =>
    apiClient.post<ApiResponse<T>>(url, data, config),
  put: <T>(url: string, data?: any, config?: any) =>
    apiClient.put<ApiResponse<T>>(url, data, config),
  delete: <T>(url: string, config?: any) =>
    apiClient.delete<ApiResponse<T>>(url, config),
  patch: <T>(url: string, data?: any, config?: any) =>
    apiClient.patch<ApiResponse<T>>(url, data, config),
}

export default apiClient
