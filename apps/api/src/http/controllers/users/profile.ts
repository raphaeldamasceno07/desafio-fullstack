import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  const {
    password_hash: _password_hash,
    created_at,
    updated_at: _updated_at,
    ...userWithoutPassword
  } = user
  void _password_hash
  void _updated_at

  return reply.status(200).send({
    ...userWithoutPassword,
    createdAt: created_at.toISOString(),
  })
}
