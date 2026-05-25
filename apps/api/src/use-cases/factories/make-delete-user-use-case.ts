import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { DeleteUserUseCase } from '../user/delete-user'

export function makeDeleteUserUseCase() {
  const usersRepository = new PrismaUsersRepository()

  return new DeleteUserUseCase(usersRepository)
}
