'use client'
import { ErrorMessage } from '../components/error-message'
import { FormContainer } from '../components/form-container'
import { Input } from '../components/input'
import { SubmitButton } from '../components/submit-button'
import { useRegister } from './use-register'

export default function RegisterPage() {
  const { register, errors, isSubmitting, apiError, onSubmit } = useRegister()

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-10">
      <FormContainer onSubmit={onSubmit}>
        {apiError && (
          <div className="rounded-sm bg-red-500/10 p-3 border border-red-500/20">
            <ErrorMessage message={apiError} />
          </div>
        )}

        <Input
          label="Name"
          type="text"
          placeholder="Digite seu Nome"
          error={errors.name?.message as string}
          {...register('name')}
        />

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

        <Input
          label="Confirmação de senha"
          type="password"
          placeholder="Digite sua senha novamente"
          error={errors.confirmPassword?.message as string}
          {...register('confirmPassword')}
        />

        <div className="flex w-full justify-end pt-4">
          <SubmitButton disabled={isSubmitting}>
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </SubmitButton>
        </div>
      </FormContainer>
    </main>
  )
}
