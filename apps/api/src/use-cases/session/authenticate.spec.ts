import { FakeHashProvider } from '@/providers/HashProvider/fakes/fake-hash-provider'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InvalidCredentialsError } from '../errors/invalid-credentials'
import { AuthenticationUseCase } from './authenticate'

let usersRepository: InMemoryUserRepository
let hashProvider: FakeHashProvider
let sut: AuthenticationUseCase

describe('Authentication Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    hashProvider = new FakeHashProvider()

    sut = new AuthenticationUseCase(usersRepository, hashProvider)
  })

  it('should be able to authenticate', async () => {
    const password_hash = await hashProvider.generateHash('123456')

    const newUser = await usersRepository.create({
      name: 'Raphael',
      email: 'raphael@example.com',
      password_hash,
    })

    const { user } = await sut.execute({
      email: 'raphael@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await usersRepository.create({
      name: 'Raphael',
      email: 'raphael@example.com',
      password_hash: await hashProvider.generateHash('123456'),
    })

    await expect(async () => {
      await sut.execute({
        email: 'wrong@example.com',
        password: '123456',
      })
    }).rejects.instanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Raphael',
      email: 'raphael@example.com',
      password_hash: await hashProvider.generateHash('123456'),
    })

    await expect(async () => {
      await sut.execute({
        email: 'raphael@example.com',
        password: 'wrong-password',
      })
    }).rejects.instanceOf(InvalidCredentialsError)
  })
})
