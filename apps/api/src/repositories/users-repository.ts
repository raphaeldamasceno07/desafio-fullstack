import { CreateUserRequest } from '@movie-challenge/core-types'
import { User } from '../../generated/prisma/client'

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserRequest): Promise<User>
}
