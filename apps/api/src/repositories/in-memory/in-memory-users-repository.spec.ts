import { InMemoryUserRepository } from './in-memory-users-repository'

describe('In-Memory Users Repository', () => {
  let sut: InMemoryUserRepository

  beforeEach(() => {
    sut = new InMemoryUserRepository()
  })

  it('should return null when trying to update a non-existing user', async () => {
    const updatedUser = await sut.update('fake-id', { name: 'New Name' })

    expect(updatedUser).toBeNull()
  })

  it('should safely do nothing when trying to delete a non-existing user', async () => {
    await sut.delete('fake-id')

    expect(sut.items).toHaveLength(0)
  })
})
