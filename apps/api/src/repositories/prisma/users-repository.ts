import { prisma } from '@/lib/prisma'
import { CreateUserRequest } from '@movie-challenge/core-types'
import { User } from '@prisma/client'
import { UserRepository } from '../users-repository'

export class PrismaUsersRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    return user
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  }
  async create(data: CreateUserRequest): Promise<User> {
    const user = await prisma.user.create({
      data,
    })
    return user
  }
}
