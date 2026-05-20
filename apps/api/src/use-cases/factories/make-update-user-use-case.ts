import { BCryptHashProvider } from '@/providers/HashProvider/BCryptHashProvider'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { UpdateUsersUseCase } from '../user/update-user'

export function makeUpdateUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const hashProvider = new BCryptHashProvider()

  return new UpdateUsersUseCase(usersRepository, hashProvider)
}
