import { BCryptHashProvider } from '@/providers/HashProvider/BCryptHashProvider'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { RegisterUserUseCase } from '../user/register'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const hashProvider = new BCryptHashProvider()

  return new RegisterUserUseCase(usersRepository, hashProvider)
}
