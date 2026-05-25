import { UserRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'

export interface DeleteUserUseCaseRequest {
  userId: string
}

export class DeleteUserUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({ userId }: DeleteUserUseCaseRequest): Promise<void> {
    const foundUser = await this.usersRepository.findById(userId)

    if (!foundUser) throw new ResourceNotFoundError()

    await this.usersRepository.delete(userId)
  }
}
