import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/services/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { RegisterFormData, registerFormSchema } from './schema'

export function useRegister() {
  const { login } = useAuth()
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setApiError(null)
    try {
      const response = await api.post('/users', {
        name: data.name,
        email: data.email,
        password: data.password,
      })

      const { token } = response.data

      await login(token)
    } catch (error) {
      setApiError(
        'Falha ao realizar cadastro. Verifique os dados ou tente outro e-mail.',
      )
    }
  }

  return {
    register,
    errors,
    isSubmitting,
    apiError,
    onSubmit: handleSubmit(handleRegisterSubmit),
  }
}
