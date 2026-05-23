import axios, { AxiosError } from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api',
})

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

// Interceptor de Resposta
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof document !== 'undefined') {
        // Limpa o cookie de autenticação expirado
        document.cookie =
          'movie-challenge.token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        localStorage.removeItem('@movie-challenge:user')
        
        // Redireciona de forma limpa para o login
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)