import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/use-cases/factories/test/create-and-authenticate-user'
import { createUser } from '@/use-cases/factories/test/create-user'
import crypto from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Update Movie (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.movie.deleteMany()
  })

  it('should be able to update a movie if user is the owner', async () => {
    const ownerEmail = `owner-${crypto.randomUUID()}@example.com`

    const ownerData = {
      name: 'Movie Owner',
      email: ownerEmail,
      password: '123456',
    }

    const { token, id } = await createAndAuthenticateUser(app, ownerData as any)

    await request(app.server).post('/sessions').send({
      email: ownerData.email,
      password: '123456',
    })

    const movie = await prisma.movie.create({
      data: {
        title: 'Filme Antigo',
        original_title: 'Old Movie',
        description: 'Old description',
        duration: 100,
        budget: 50000000,
        genre: 'Drama',
        slug: `old-movie-${crypto.randomUUID()}`,
        user_id: id,
        release_date: new Date(),
      },
    })

    const response = await request(app.server)
      .put(`/movies/${movie.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Filme Atualizado E2E',
        original_title: 'Updated Movie E2E',
        description: 'New fresh description',
        duration: 120,
        budget: 60000000,
        genre: 'Ação',
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.movie.title).toEqual('Filme Atualizado E2E')
  })

  it('should not be able to update a movie if user is not the owner', async () => {
    const owner = await createUser()

    const movie = await prisma.movie.create({
      data: {
        title: 'Inception',
        original_title: 'Inception',
        description: 'Dream within a dream',
        duration: 148,
        budget: 160000000,
        genre: 'Ficção',
        slug: `inception-${crypto.randomUUID()}`,
        user_id: owner.user.id,
        release_date: new Date(),
      },
    })

    const hackerEmail = `hacker-${crypto.randomUUID()}@example.com`

    const data = {
      name: 'Hacker User',
      email: hackerEmail,
      password: '123456',
    }

    const { token } = await createAndAuthenticateUser(app, data as any)

    const response = await request(app.server)
      .put(`/movies/${movie.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Hackeado',
        original_title: 'Hacked',
        description: 'Trying to change details',
        duration: 148,
        budget: 160000000,
        genre: 'Ficção',
      })

    expect(response.statusCode).toEqual(403)
  })
})
