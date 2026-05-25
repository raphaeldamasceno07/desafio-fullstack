import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { GetUserProfileUseCase } from '../user/get-user-profile'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUseCase(usersRepository)

  return useCase
}
