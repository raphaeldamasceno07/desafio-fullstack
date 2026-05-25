import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { BCryptHashProvider } from '@/providers/HashProvider/bcrypt-hash-provider'
import request from 'supertest'

const hashProvider = new BCryptHashProvider()

const user = {
  name: 'Raphael Damasceno',
  email: 'jraphael@example.com',
  password: 'password123',
}

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  it('should be able to authenticate', async () => {
    const password_hash = await hashProvider.generateHash(user.password)

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password_hash,
      },
    })

    const response = await request(app.server).post('/api/sessions').send({
      email: user.email,
      password: user.password,
    })

    expect(response.body).toEqual({
      token: expect.any(String),
      user: {
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
      },
    })
  })

  it('should return 400 when password is missing', async () => {
    const response = await request(app.server).post('/api/sessions').send({
      email: user.email,
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Validation error.')
  })
})
