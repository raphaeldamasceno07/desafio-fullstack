'use client'

import { api } from '@/services/api'
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
    } catch (error: any) {
      console.error('Falha ao carregar usuário:', error)

      const isAuthPage = ['/login', '/register'].includes(
        window.location.pathname,
      )

      if (!isAuthPage) {
        router.push('/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = (token: string, userData: User) => {
    document.cookie = `movie-challenge.token=${token}; path=/; max-age=900` // 15 min
    setUser(userData)
    router.push('/movies')
  }

  const logout = () => {
    document.cookie =
      'movie-challenge.token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
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
