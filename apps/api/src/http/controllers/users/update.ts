import { makeUpdateUserUseCase } from '@/use-cases/factories/make-update-user-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = request.body as {
    name?: string
    email?: string
    password?: string
  }

  const updateUserUseCase = makeUpdateUserUseCase()

  const { user } = await updateUserUseCase.execute({
    user: {
      id: request.user.sub,
      name,
      email,
      password,
    },
  })

  const { created_at, updated_at, ...userWithoutPassword } = user as {
    id: string
    name: string
    email: string
    password_hash?: string
    created_at: Date
    updated_at: Date
  }

  return reply.status(200).send({
    ...userWithoutPassword,
    createdAt: created_at.toISOString(),
    updatedAt: updated_at.toISOString(),
  })
}
