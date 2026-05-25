import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api',
  withCredentials: true,
})

api.interceptors.request.use(config => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/movie-challenge\.token=([^;]+)/)
    const token = match ? match[1] : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config as any

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true

      try {
        const { data } = await api.patch(
          '/token/refresh',
          {},
          { withCredentials: true },
        )
        const { token } = data

        document.cookie = `movie-challenge.token=${token}; path=/; max-age=900`

        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token failed')
        document.cookie =
          'movie-challenge.token=; path=/; expires=Thu, 01 Jan 1970'
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)
