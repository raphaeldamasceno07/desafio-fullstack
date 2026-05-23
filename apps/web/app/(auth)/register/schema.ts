import z from 'zod'

export const registerFormSchema = z
  .object({
    name: z.string().min(1, 'O nome é obrigatório'),
    email: z.string().email('Formato de e-mail inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerFormSchema>
