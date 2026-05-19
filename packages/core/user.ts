import z from 'zod'

export const registerBodySchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.email('Formato de e-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
})

export type CreateUserRequest = z.infer<typeof createUserSchema>

export interface UserDTO {
  id: string
  name: string
  email: string
  createdAt: string
}
