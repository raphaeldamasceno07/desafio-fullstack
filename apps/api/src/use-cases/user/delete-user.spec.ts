import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { DeleteUserUseCase } from './delete-user'

let usersRepository: InMemoryUserRepository
let sut: DeleteUserUseCase

describe('Delete user use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    sut = new DeleteUserUseCase(usersRepository)
  })

  it('should be able to delete user', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: 'hashed_password',
    })

    await sut.execute({ userId: createdUser.id })

    const foundUser = await usersRepository.findById(createdUser.id)

    expect(foundUser).toBeNull()
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(
      sut.execute({ userId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
