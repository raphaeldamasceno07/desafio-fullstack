'use client'

import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/services/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Film } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoginFormData, loginSchema } from './types/loginType'

export default function LoginPage() {
  const { login } = useAuth()
  const [apiError, setApiError] = useState<string | null>(null)

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

      // Extrai o token e os dados do usuário mapeados no seu controller
      const { token, user } = response.data

      // Alimenta o Contexto (salva cookie, localStorage e redireciona)
      login(token, user)
    } catch (err: any) {
      console.error('Erro na autenticação:', err)

      // Tratamento de erro amigável para o usuário
      if (err.response?.status === 400 || err.response?.status === 401) {
        setApiError('E-mail ou senha incorretos.')
      } else {
        setApiError(
          'Desculpe, ocorreu um erro interno no servidor. Tente novamente mais tarde.',
        )
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Container Principal - Mobile First (100% no celular, max-w no desktop) */}
      <div className="w-full max-w-md mx-auto space-y-8 bg-surface p-6 rounded-lg border border-border shadow-lg md:p-8">
        {/* Cabeçalho do Formulário */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Film className="w-10 h-10 text-brand" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            CineBase
          </h2>
          <p className="mt-2 text-sm text-muted">
            Faça login para gerenciar seu catálogo de filmes
          </p>
        </div>

        {/* Alerta de erro da API se houver */}
        {apiError && (
          <div className="bg-brand-low border border-brand/30 text-brand text-sm px-4 py-3 rounded-md font-medium text-center">
            {apiError}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu-email@exemplo.com"
              {...register('email')}
              className="input-text"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-brand font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="input-text"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-brand font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Botão Primário do Tailwind v4 */}
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Link de Navegação */}
        <div className="text-center text-sm text-muted mt-4">
          Não tem uma conta?{' '}
          <Link
            href="/register"
            className="text-brand hover:underline font-medium transition-colors"
          >
            Crie sua conta
          </Link>
        </div>
      </div>
    </div>
  )
}
