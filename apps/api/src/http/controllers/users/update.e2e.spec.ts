import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import {
  createAndAuthenticateUser,
  defaultUser,
} from '@/use-cases/factories/test/create-and-authenticate-user'
import request from 'supertest'

describe('Update User Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  it('should update the authenticated user profile', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .patch('/api/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Jane Doe',
      })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Jane Doe')
    expect(response.body.email).toBe(defaultUser.email)
    expect(response.body).not.toHaveProperty('password_hash')
  })

  it('should be able to update user password', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .patch('/api/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        password: 'new_secret_password_123',
      })

    expect(response.status).toBe(200)
    expect(response.body).not.toHaveProperty('password_hash')
  })

  it('should not be able to update profile without authentication', async () => {
    const response = await request(app.server).patch('/api/me').send({
      name: 'Jane Doe',
    })

    expect(response.status).toBe(401)
  })
})
