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

  async update(
    id: string,
    data: Partial<Omit<User, 'id'>>,
  ): Promise<User | null> {
    try {
      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data,
      })
      return updatedUser
    } catch (error) {
      return null
    }
  }
}
