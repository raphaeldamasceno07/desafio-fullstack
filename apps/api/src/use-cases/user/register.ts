import { IHashProvider } from '@/providers/HashProvider/IHashProvider'
import { UserRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { UserAlreadyExistsError } from '../errors/user-already-exists'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUserUseCase {
  constructor(
    private usersRepository: UserRepository,
    private hashProvider: IHashProvider,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const emailExists = await this.usersRepository.findByEmail(email)

    const password_hash = await this.hashProvider.generateHash(password)

    if (emailExists) throw new UserAlreadyExistsError()

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
