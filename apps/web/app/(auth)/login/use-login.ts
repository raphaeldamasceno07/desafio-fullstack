import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/services/api'
import { loginSchema, LoginFormData } from './schema'

export function useLogin() {
  const { login } = useAuth()
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const handleLoginSubmit = async (data: LoginFormData) => {
    setApiError(null) 
    try {
      const response = await api.post('/sessions', {
        email: data.email,
        password: data.password,
      })

      const { token, user } = response.data

      await login(token, user)
      
    } catch (error) {
      setApiError('E-mail ou senha incorretos. Tente novamente.')
    }
  }

  return {
    register,
    errors,
    isSubmitting,
    apiError,
    onSubmit: handleSubmit(handleLoginSubmit)
  }
}