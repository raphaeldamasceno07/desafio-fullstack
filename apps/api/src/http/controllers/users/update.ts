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

  // 🌟 Envia EXATAMENTE o que o schema do Zod pede: id, name, email e createdAt
  return reply.status(200).send({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  })
}
