import { BCryptHashProvider } from '@/providers/HashProvider/bcrypt-hash-provider'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { RegisterUserUseCase } from '../user/register'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const hashProvider = new BCryptHashProvider()

  return new RegisterUserUseCase(usersRepository, hashProvider)
}
