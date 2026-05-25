import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { authenticateBodySchema } from '@movie-challenge/core-types'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function session(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = authenticateBodySchema.parse(request.body)

  const authenticateUseCase = makeAuthenticateUseCase()
  const { user } = await authenticateUseCase.execute({ email, password })

  // Access Token - curta duração (15 minutos)
  const token = await reply.jwtSign(
    {},
    { sign: { sub: user.id, expiresIn: '15m' } },
  )

  const refreshToken = await reply.jwtSign(
    {},
    { sign: { sub: user.id, expiresIn: '7d' } },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .status(200)
    .send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
}
