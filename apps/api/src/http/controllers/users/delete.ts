import { makeDeleteUserUseCase } from '@/use-cases/factories/make-delete-user-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const deleteUserUseCase = makeDeleteUserUseCase()

  await deleteUserUseCase.execute({ userId: request.user.sub })

  return reply.status(204).send()
}
