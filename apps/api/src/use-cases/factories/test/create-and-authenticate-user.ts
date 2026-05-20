import { prisma } from '@/lib/prisma'
import { BCryptHashProvider } from '@/providers/HashProvider/bcrypt-hash-provider'
import { Prisma } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import request from 'supertest'

export const defaultUser = {
  name: 'John Doe',
  email: `johndoe-${randomUUID()}@example.com`,
  password: 'password123',
}

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  customData?: Partial<Prisma.UserCreateInput> & { password?: string },
) {
  const hashProvider = new BCryptHashProvider()

  const email = customData?.email ?? defaultUser.email
  const name = customData?.name ?? defaultUser.name
  const password = customData?.password ?? defaultUser.password

  const password_hash = customData?.password_hash
    ? customData.password_hash
    : await hashProvider.generateHash(password)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email,
    password,
  })

  const { token } = authResponse.body

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  })

  return {
    token,
    id: user.id,
  }
}
