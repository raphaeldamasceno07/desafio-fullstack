import axios, { AxiosError } from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api',
  withCredentials: true,
})

let isRefreshing = false
let failedQueue: any[] = []

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

api.interceptors.request.use(config => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(
      new RegExp('(^|;)\\s*movie-challenge\\.token=([^;]+)'),
    )
    const token = match ? match[2] : null

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await api.patch('/token/refresh')

        const { token } = response.data

        document.cookie = `movie-challenge.token=${token}; path=/`

        api.defaults.headers.Authorization = `Bearer ${token}`

        processQueue(null, token)

        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)

        document.cookie =
          'movie-challenge.token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

        window.location.href = '/login'

        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)
