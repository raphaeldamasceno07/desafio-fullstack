import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { CloudflareR2StorageProvider } from '@/providers/StorageProvider/implementations/cloudflare-r2-storage-provider'
import { createAndAuthenticateUser } from '@/use-cases/factories/test/create-and-authenticate-user'
import crypto from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

vi.spyOn(CloudflareR2StorageProvider.prototype, 'upload').mockResolvedValue(
  'https://pub-mock-storage.r2.dev/test-poster.jpg',
)

describe('Fetch Movies (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.movie.deleteMany()
  })

  it('should be able to fetch a paginated and filtered list of movies', async () => {
    const { token, id } = await createAndAuthenticateUser(app)

    await prisma.movie.create({
      data: {
        title: 'Matrix Reloaded',
        original_title: 'The Matrix Reloaded',
        description: 'Neo faces new threats.',
        duration: 138,
        release_date: new Date('2026-05-10T12:00:00.000Z'),
        budget: 150000000,
        genre: 'Ficção',
        slug: `matrix-reloaded-${crypto.randomUUID()}`,
        user_id: id,
      },
    })

    await prisma.movie.create({
      data: {
        title: 'Matrix Revolutions',
        original_title: 'The Matrix Revolutions',
        description: 'The epic conclusion.',
        duration: 160,
        release_date: new Date('2026-05-15T12:00:00.000Z'),
        budget: 150000000,
        genre: 'Ficção',
        slug: `matrix-revolutions-${crypto.randomUUID()}`,
        user_id: id,
      },
    })

    await prisma.movie.create({
      data: {
        title: 'Se Beber, Não Case',
        original_title: 'The Hangover',
        description: 'A wild night in Vegas.',
        duration: 100,
        release_date: new Date('2026-05-12T12:00:00.000Z'),
        budget: 35000000,
        genre: 'Comédia',
        slug: `the-hangover-${crypto.randomUUID()}`,
        user_id: id,
      },
    })

    const response = await request(app.server)
      .get('/movies')
      .set('Authorization', `Bearer ${token}`)
      .query({
        search: 'matrix',
        genre: 'Ficção',
        durationMax: 140,
        releaseDateStart: '2026-05-01',
        releaseDateEnd: '2026-05-20',
        page: 1,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.movies).toHaveLength(1)
    expect(response.body.movies[0].title).toEqual('Matrix Reloaded')
    expect(response.body.movies[0]).toHaveProperty('slug')
  })

  it('should not be able to fetch movies without an authentication token', async () => {
    const response = await request(app.server).get('/movies').query({ page: 1 })

    expect(response.statusCode).toEqual(401)
  })
})
