import { CreateUserRequest } from '@movie-challenge/core-types'
import { User } from '@prisma/client'

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserRequest): Promise<User>
  update(id: string, data: Partial<CreateUserRequest>): Promise<User>
  delete(id: string): Promise<void>
}
