import { CreateUserRequest } from '@movie-challenge/core-types'
import { User } from '@prisma/client'
import { UserRepository } from '../users-repository'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find(item => item.id === id)

    if (!user) return null

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find(item => item.email === email)

    if (!user) return null

    return user
  }

  async create(data: CreateUserRequest) {
    const newUser = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      createdAt: new Date(),
    }

    this.items.push(newUser)

    return newUser
  }

  async update(id: string, data: Partial<CreateUserRequest>) {
    const userIndex = this.items.findIndex(item => item.id === id)

    if (userIndex === -1) return null

    const updatedUser = { ...this.items[userIndex], ...data }
    this.items[userIndex] = updatedUser

    return updatedUser
  }
}
