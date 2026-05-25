'use client'

import { api, clearTokenCookie, setTokenCookie } from '@/services/api'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    try {
      const res = await api.get('/me')
      setUser(res.data)
    } catch {
      // Se o token não for renovável (refresh expirado ou ausente), redireciona
      const isAuthPage = ['/login', '/register'].includes(window.location.pathname)
      if (!isAuthPage) {
        router.push('/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = (token: string, userData: User) => {
    setTokenCookie(token) // cookie 7 dias — mesmo TTL do refreshToken
    setUser(userData)
    router.push('/movies')
  }

  const logout = () => {
    clearTokenCookie()
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
