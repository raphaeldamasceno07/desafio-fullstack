import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/use-cases/factories/test/create-and-authenticate-user'
import crypto from 'node:crypto'
import request from 'supertest'

describe('Delete Movie (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  afterEach(async () => {
    await prisma.movie.deleteMany()
  })

  it('should be able to delete a movie if user is the owner', async () => {
    const { token, id } = await createAndAuthenticateUser(app)

    const movie = await prisma.movie.create({
      data: {
        title: 'Filme para Deletar',
        original_title: 'Movie to Delete',
        description: 'This movie will be removed.',
        duration: 95,
        budget: 10000000,
        genre: 'Comédia',
        slug: `movie-delete-${crypto.randomUUID()}`,
        user_id: id,
        release_date: new Date(),
      },
    })

    const response = await request(app.server)
      .delete(`/movies/${movie.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(204)

    const movieOnDatabase = await prisma.movie.findUnique({
      where: { id: movie.id },
    })

    expect(movieOnDatabase).toBeNull()
  })

  it('should not be able to delete a movie if user is not the owner', async () => {
    const owner = {
      name: 'Real Owner',
      email: `owner-${crypto.randomUUID()}@example.com`,
      password: '123456',
    }

    const hackerData = {
      name: 'Hacker User',
      email: `hacker-${crypto.randomUUID()}@example.com`,
      password: '123456',
    }

    const { id: ownerId } = await createAndAuthenticateUser(app, owner as any)

    const { token: hackerToken } = await createAndAuthenticateUser(
      app,
      hackerData as any,
    )
    const movie = await prisma.movie.create({
      data: {
        title: 'Filme Protegido',
        original_title: 'Protected Movie',
        description: 'Hackers cannot touch this.',
        duration: 150,
        budget: 85000000,
        genre: 'Suspense',
        slug: `protected-${crypto.randomUUID()}`,
        user_id: ownerId,
        release_date: new Date(),
      },
    })

    const response = await request(app.server)
      .delete(`/movies/${movie.id}`)
      .set('Authorization', `Bearer ${hackerToken}`)

    expect(response.statusCode).toEqual(403)

    const movieOnDatabase = await prisma.movie.findUnique({
      where: { id: movie.id },
    })

    expect(movieOnDatabase).toBeTruthy()
  })
})
