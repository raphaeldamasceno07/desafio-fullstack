import axios, { AxiosError } from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
})

api.interceptors.request.use(config => {
  const match = document.cookie.match(
    new RegExp('(^| ) movie-challenge.token=([^;]+)'),
  )
  const token = match ? match[2] : null

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      document.cookie =
        'movie-challenge.token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      localStorage.removeItem('@movie-challenge:user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)
