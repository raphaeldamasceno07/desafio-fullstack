import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { BCryptHashProvider } from '@/providers/HashProvider/BCryptHashProvider'
import request from 'supertest'

const hashProvider = new BCryptHashProvider()

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  it('should be able to register and persist user with hashed password in database', async () => {
    const email = 'jane.doe@example.com'
    const password = 'password123'

    const response = await request(app.server).post('/users').send({
      name: 'Jane Doe',
      email,
      password,
    })

    expect(response.status).toBe(201)

    const userInDatabase = await prisma.user.findUnique({
      where: { email },
    })

    expect(userInDatabase).toBeTruthy()

    expect(userInDatabase?.password_hash).not.toBe(password)

    const isPasswordValid = await hashProvider.compareHash(
      password,
      userInDatabase!.password_hash,
    )

    expect(isPasswordValid).toBe(true)
  })

  it('should return 409 when trying to register with an existing email', async () => {
    const email = 'duplicate@example.com'

    await request(app.server).post('/users').send({
      name: 'User 1',
      email,
      password: 'password123',
    })

    const response = await request(app.server).post('/users').send({
      name: 'User 2',
      email,
      password: 'password123',
    })

    expect(response.status).toBe(409)
    expect(response.body.message).toBe('User already exists.')
  })

  it('should return 400 when trying to register with invalid data', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'User 1',
      email: 'invalid-email',
      password: 'password123',
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Validation error.')
  })
})
