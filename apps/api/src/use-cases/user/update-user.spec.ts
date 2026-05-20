import { FakeHashProvider } from '@/providers/HashProvider/fakes/fake-hash-provider'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { UpdateUsersUseCase } from './update-user'

let userRepository: InMemoryUserRepository
let hashProvider: FakeHashProvider
let sut: UpdateUsersUseCase

describe('Update user use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    hashProvider = new FakeHashProvider()
    sut = new UpdateUsersUseCase(userRepository, hashProvider)
  })

  it('should be able to update user profile name', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: 'hashed_password',
    })

    const updatedUser = await sut.execute({
      user: {
        id: createdUser.id,
        name: 'Jane Doe',
      },
    })

    expect(updatedUser.user.name).toBe('Jane Doe')
  })

  it('should be able to update user password', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: 'old_hashed_password',
    })

    const updatedUser = await sut.execute({
      user: {
        id: createdUser.id,
        password: 'new_password_123',
      },
    })

    expect(updatedUser.user.id).toEqual(createdUser.id)
    const userInDatabase = userRepository.items[0]
    expect(userInDatabase.password_hash).not.toBe('old_hashed_password')
  })

  it('should not to be able to update user with non existing id', async () => {
    await expect(() =>
      sut.execute({
        user: {
          id: 'non-existing-id',
          password: 'new_password_123',
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
