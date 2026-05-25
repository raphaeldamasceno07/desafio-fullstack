import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { registerBodySchema } from '@movie-challenge/core-types'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  const registerUserUseCase = makeRegisterUseCase()

  await registerUserUseCase.execute({
    name,
    email,
    password,
  })

  return reply.status(201).send({ message: 'User created successfully' })
}
