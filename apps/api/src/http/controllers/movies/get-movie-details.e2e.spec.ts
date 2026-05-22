import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/use-cases/factories/test/create-and-authenticate-user'
import request from 'supertest'

describe('Get Movie Details (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeAll(async () => {
    await prisma.movie.deleteMany()
  })

  it('should be able to get movie details by slug', async () => {
    const { token, id } = await createAndAuthenticateUser(app)

    const targetSlug = `iron-man-${crypto.randomUUID()}`

    await prisma.movie.create({
      data: {
        title: 'Homem de Ferro',
        original_title: 'Iron Man',
        description: 'Tony Stark built an armor.',
        duration: 126,
        release_date: new Date('2008-05-02T00:00:00.000Z'),
        budget: 140000000,
        genre: 'Ação',
        slug: targetSlug,
        user_id: id,
      },
    })

    const response = await request(app.server)
      .get(`/movies/slug/${targetSlug}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.movie.title).toEqual('Homem de Ferro')
    expect(response.body.movie.slug).toEqual(targetSlug)
  })
})
