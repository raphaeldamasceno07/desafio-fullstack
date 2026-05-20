import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { GetUserProfileUseCase } from './get-user-profile'

let userRepository: InMemoryUserRepository
let sut: GetUserProfileUseCase

const createNewUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password_hash: '1234',
}

describe('Get user profile use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new GetUserProfileUseCase(userRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await userRepository.create(createNewUser)

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user).toEqual(createdUser)
    expect(user.name).toBe(createNewUser.name)
    expect(user.email).toBe(createNewUser.email)
  })

  it('should not be able to get with wrong user id', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-existing-user-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
