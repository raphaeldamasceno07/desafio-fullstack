import { FakeHashProvider } from '@/providers/HashProvider/fakes/fake-hash-provider'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from '../errors/user-already-exists'
import { RegisterUserUseCase } from './register'

let usersRepository: InMemoryUserRepository
let hashProvider: FakeHashProvider
let sut: RegisterUserUseCase

describe('Register use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    hashProvider = new FakeHashProvider()

    sut = new RegisterUserUseCase(usersRepository, hashProvider)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'jhondoe1@example.com',
      password: '123456',
    })

    expect(user.id).toBeDefined()
    expect(user.email).toBe('jhondoe1@example.com')
  })

  it('should hash password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'jhondoe1@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await hashProvider.compareHash(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
    expect(user.password_hash).toEqual('123456-hashed')
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'jhondoe1@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
