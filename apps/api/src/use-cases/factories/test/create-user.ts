import { prisma } from '@/lib/prisma'
import { BCryptHashProvider } from '@/providers/HashProvider/bcrypt-hash-provider'
import { Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export const defaultUser = {
  name: 'John Doe',
  email: `johndoe-${randomUUID()}@example.com`,
  password: 'password123',
}

export async function createUser(
  customData?: Partial<Prisma.UserCreateInput> & { password?: string },
) {
  const hashProvider = new BCryptHashProvider()

  const email = customData?.email ?? defaultUser.email
  const name = customData?.name ?? defaultUser.name
  const password = customData?.password ?? defaultUser.password

  const password_hash = customData?.password_hash
    ? customData.password_hash
    : await hashProvider.generateHash(password)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })

  return {
    user,
  }
}
