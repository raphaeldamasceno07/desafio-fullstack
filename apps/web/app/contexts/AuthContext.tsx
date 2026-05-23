'use client'

import { useRouter } from 'next/navigation'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { api } from '../services/api'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user?: User) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUserProfile() {
      const match = document.cookie.match(
        new RegExp('(^| )movie-challenge.token=([^;]+)'),
      )
      const token = match ? match[2] : null

      if (token) {
        try {
          const response = await api.get('/me')

          setUser(response.data.user)
        } catch (error) {
          console.error('Falha ao recuperar perfil automaticamente', error)
        }
      }

      setIsLoading(false)
    }

    loadUserProfile()
  }, [])

  const login = async (token: string, userData?: User) => {
    document.cookie = `movie-challenge.token=${token}; path=/; max-age=604800; SameSite=Strict`

    if (userData) {
      setUser(userData)
    } else {
      const response = await api.get('/me')
      setUser(response.data.user)
    }

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
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
