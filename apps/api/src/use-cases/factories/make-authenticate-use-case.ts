import { BCryptHashProvider } from '@/providers/HashProvider/bcrypt-hash-provider'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { AuthenticationUseCase } from '../session/authenticate'

export function makeAuthenticateUseCase() {
  const userRepository = new PrismaUsersRepository()
  const hashProvider = new BCryptHashProvider()
  const authenticateUseCase = new AuthenticationUseCase(
    userRepository,
    hashProvider,
  )

  return authenticateUseCase
}
