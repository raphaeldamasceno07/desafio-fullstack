'use client'

import Link from 'next/link'
import { Input } from '../components/input'
import { SubmitButton } from '../components/submit-button'
import { ErrorMessage } from '../components/error-message'
import { useLogin } from './use-login'
import { FormContainer } from '../components/form-container.tsx'

export default function LoginPage() {
  const { register, errors, isSubmitting, apiError, onSubmit } = useLogin()

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