import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/services/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoginFormData, loginSchema } from './schema'

export function useLogin() {
  const { login } = useAuth()
  const [apiError, setApiError] = useState
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function handleLogin(data: LoginFormData) {
    try {
      setApiError(null)

      const response = await api.post('/sessions', {
        email: data.email,
        password: data.password,
      })

      const { token, user } = response.data

      login(token, user)
    } catch (err: any) {
      console.error('Erro na autenticação:', err)

      if (err.response?.status === 400 || err.response?.status === 401) {
        setApiError('E-mail ou senha incorretos.')
      } else {
        setApiError(
          'Desculpe, ocorreu um erro interno no servidor. Tente novamente.',
        )
      }
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(handleLogin),
    errors,
    isSubmitting,
    apiError,
  }
}
