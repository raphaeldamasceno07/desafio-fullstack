import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/use-cases/factories/test/create-and-authenticate-user'
import request from 'supertest'

const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
}

describe('Delete User Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  it('should delete the authenticated user', async () => {
    const { token } = await createAndAuthenticateUser(app, user)

    const response = await request(app.server)
      .delete('/api/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)

    const profileResponse = await request(app.server)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`)

    expect(profileResponse.status).toBe(404)
  })

  it('should not be able to delete profile without authentication', async () => {
    const response = await request(app.server).delete('/api/me')

    expect(response.status).toBe(401)
  })
})
