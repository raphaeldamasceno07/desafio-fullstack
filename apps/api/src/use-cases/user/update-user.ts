import { IHashProvider } from '@/providers/HashProvider/hash-provider'
import { UserRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'

export interface UpdateUserUseCaseRequest {
  user: {
    id: string
    name?: string
    email?: string
    password?: string
  }
}

export type UserWithoutPassword = Omit<User, 'password_hash'>

export interface UpdateUserUseCaseResponse {
  user: UserWithoutPassword
}

export class UpdateUsersUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashProvider: IHashProvider,
  ) {}

  async execute({
    user: { id, password, ...updateData },
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const existingUser = await this.userRepository.findById(id)

    if (!existingUser) throw new ResourceNotFoundError()
    const dataToUpdate: any = { ...updateData }

    if (password) {
      dataToUpdate.password_hash =
        await this.hashProvider.generateHash(password)
    }

    const updatedUser = await this.userRepository.update(id, dataToUpdate)

    if (!updatedUser) throw new ResourceNotFoundError()

    const { password_hash, ...userWithoutPassword } = updatedUser

    return {
      user: userWithoutPassword,
    }
  }
}
