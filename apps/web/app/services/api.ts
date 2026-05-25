import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api'

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

// Instância separada APENAS para o refresh — não passa pelo interceptor de resposta
const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

const COOKIE_NAME = 'movie-challenge.token'
// Cookie dura 7 dias — mesmo tempo do refreshToken da API
// O JWT em si expira em 15 min; quando a API retorna 401 o interceptor renova
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 604800 segundos

function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/movie-challenge\.token=([^;]+)/)
  return match ? match[1] : null
}

export function setTokenCookie(token: string) {
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}`
}

export function clearTokenCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

api.interceptors.request.use(config => {
  const token = getTokenFromCookie()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true

      try {
        // Usa authApi (sem interceptor) para não entrar em loop
        const { data } = await authApi.patch('/token/refresh')
        setTokenCookie(data.token)
        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return api(originalRequest)
      } catch {
        clearTokenCookie()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  },
)
