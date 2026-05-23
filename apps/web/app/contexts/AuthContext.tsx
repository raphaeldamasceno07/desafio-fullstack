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
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 🔥 FUNÇÃO CENTRAL (REUTILIZÁVEL)
  async function fetchUser() {
    try {
      const response = await api.get('/me')
      setUser(response.data)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // 🔁 roda ao carregar app
  useEffect(() => {
    fetchUser()
  }, [])

  // ✅ LOGIN CORRETO
  const login = async (token: string) => {
    document.cookie = `movie-challenge.token=${token}; path=/; max-age=604800; SameSite=Strict`

    // 🔥 busca usuário imediatamente
    await fetchUser()

    // 🔥 força atualização da UI
    router.push('/movies')
    router.refresh()
  }

  const logout = () => {
    document.cookie =
      'movie-challenge.token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

    setUser(null)

    router.push('/login')
    router.refresh()
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
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}