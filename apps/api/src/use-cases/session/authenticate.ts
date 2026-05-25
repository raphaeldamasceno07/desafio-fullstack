import { IHashProvider } from '@/providers/HashProvider/hash-provider'
import { UserRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { InvalidCredentialsError } from '../errors/invalid-credentials'

interface AuthenticationUseCaseRequest {
  email: string
  password: string
}

interface AuthenticationUseCaseResponse {
  user: User
}

export class AuthenticationUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashProvider: IHashProvider,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticationUseCaseRequest): Promise<AuthenticationUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) throw new InvalidCredentialsError()

    const doesPasswordMatch = await this.hashProvider.compareHash(
      password,
      user.password_hash,
    )

    if (!doesPasswordMatch) throw new InvalidCredentialsError()

    return { user }
  }
}
