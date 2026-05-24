'use client'

import { useAuth } from '@/contexts/AuthContext' // 🌟 Puxamos o seu contexto global
import Link from 'next/link'
import { useRouter } from 'next/navigation' // 🌟 Navegação do App Router
import { useEffect } from 'react'
import { ErrorMessage } from '../components/error-message'
import { FormContainer } from '../components/form-container'
import { Input } from '../components/input'
import { SubmitButton } from '../components/submit-button'
import { useLogin } from './use-login'

export default function LoginPage() {
  const { register, errors, isSubmitting, apiError, onSubmit } = useLogin()
  const { user, isLoading } = useAuth() // 🌟 Capturamos o estado do usuário e o loading do token
  const router = useRouter()

  useEffect(() => {
    // 🌟 SE NÃO ESTIVER EM LOADING E O USUÁRIO EXISTIR: Mata o loop e joga para os filmes
    if (!isLoading && user) {
      router.replace('/movies')
    }
  }, [user, isLoading, router])

  // 🛡️ Enquanto o contexto valida o JWT ou se o usuário já estiver logado,
  // seguramos o HTML limpo na tela para o formulário não piscar de bobeira
  if (isLoading || user) {
    return (
      <div className="min-h-screen w-full bg-transparent flex items-center justify-center">
        {/* Você pode deixar em branco ou colocar um spinner sutil aqui */}
      </div>
    )
  }

  return (
    <FormContainer onSubmit={onSubmit}>
      {apiError && (
        <div className="rounded-sm bg-red-500/10 p-3 border border-red-500/20">
          <ErrorMessage message={apiError} />
        </div>
      )}

      <Input
        label="E-mail"
        type="email"
        placeholder="Digite seu E-mail"
        error={errors.email?.message as string}
        {...register('email')}
      />

      <Input
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
        error={errors.password?.message as string}
        {...register('password')}
      />

      <div className="flex items-center justify-between gap-3 pt-4">
        <Link
          href="/esqueci-senha"
          className="text-sm font-medium text-brand underline-offset-2 hover:underline"
        >
          Esqueci minha senha
        </Link>

        <SubmitButton disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </SubmitButton>
      </div>
    </FormContainer>
  )
}
