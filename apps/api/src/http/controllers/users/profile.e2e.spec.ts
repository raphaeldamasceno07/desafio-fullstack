import { app } from '@/app'
import {
  createAndAuthenticateUser,
  defaultUser,
} from '@/use-cases/factories/test/create-and-authenticate-user'
import request from 'supertest'

describe('Profile Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return the user profile', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        email: defaultUser.email,
      }),
    )
  })
})
