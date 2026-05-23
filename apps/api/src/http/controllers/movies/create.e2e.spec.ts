import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { MailhogMailProvider } from '@/providers/MailProvider/mailhog-mail-provider'
import { CloudflareR2StorageProvider } from '@/providers/StorageProvider/implementations/cloudflare-r2-storage-provider'
import { createAndAuthenticateUser } from '@/use-cases/factories/test/create-and-authenticate-user'
import crypto from 'node:crypto'
import request from 'supertest'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

let interceptedEmailData: any = null

vi.spyOn(CloudflareR2StorageProvider.prototype, 'upload').mockResolvedValue(
  'https://pub-mock-storage.r2.dev/test-poster.jpg',
)

const mockSendMail = async (data: any) => {
  interceptedEmailData = {
    Content: {
      Headers: {
        To: [data.to],
        Subject: [data.subject],
      },
    },
  }
}

vi.spyOn(MailhogMailProvider.prototype, 'sendMail').mockImplementation(
  mockSendMail,
)

describe('Create Movie (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
    vi.useRealTimers()
  })

  beforeEach(async () => {
    await prisma.movie.deleteMany()
  })

  it('should be able to create a movie with a poster', async () => {
    const uniqueEmail = `johndoe-${crypto.randomUUID()}@example.com`

    const movieOwner = {
      name: 'John Doe',
      email: uniqueEmail,
      password: '123456',
    }

    const { token } = await createAndAuthenticateUser(app, movieOwner)

    const uniqueId = crypto.randomUUID().substring(0, 8)
    const movieTitle = `Filme de Teste E2E - ${uniqueId}`
    const originalTitle = `Original E2E Movie - ${uniqueId}`

    const response = await request(app.server)
      .post('/movies')
      .set('Authorization', `Bearer ${token}`)
      .field('title', movieTitle)
      .field('original_title', originalTitle)
      .field(
        'description',
        'Descrição do filme criada através do teste automatizado.',
      )
      .field('duration', '140')
      .field('budget', '50000000')
      .field('release_date', '2026-05-20')
      .field('genre', 'Ação, Ficção')
      .attach('file', Buffer.from('fake-image-content'), 'test-poster.jpg')

    expect(response.statusCode).toEqual(201)
    expect(response.body.movie).toHaveProperty('id')
    expect(response.body.movie.title).toEqual(movieTitle)
    expect(response.body.movie.poster_url).toContain('test-poster.jpg')

    const movieOnDatabase = await prisma.movie.findUnique({
      where: { id: response.body.movie.id },
    })

    expect(movieOnDatabase).toBeTruthy()
  })

  it('should schedule an email reminder when creating a movie with a future release date', async () => {
    delete process.env.SMTP_HOST

    interceptedEmailData = null

    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-01-01T12:00:00Z'))

    const targetEmail = `cinefilo-${crypto.randomUUID()}@example.com`

    const userData = {
      name: 'Raphael Test',
      email: targetEmail,
      password: '123456',
    }

    const { token } = await createAndAuthenticateUser(app, userData)

    const futureDate = '2026-01-10'
    const uniqueId = crypto.randomUUID().substring(0, 8)
    const movieTitle = `Avatar 5 - ${uniqueId}`
    const originalTitle = `Avatar 5 Original - ${uniqueId}`

    const response = await request(app.server)
      .post('/movies')
      .set('Authorization', `Bearer ${token}`)
      .field('title', movieTitle)
      .field('original_title', originalTitle)
      .field('description', 'A super estreia do futuro.')
      .field('duration', '180')
      .field('budget', '350000000')
      .field('release_date', futureDate)
      .field('genre', 'Ficção')
      .attach('file', Buffer.from('fake-image-content'), 'avatar5.jpg')

    expect(response.statusCode).toEqual(201)

    vi.useRealTimers()

    expect(interceptedEmailData).toBeTruthy()

    expect(interceptedEmailData.Content.Headers.Subject[0]).toEqual(
      `Lembrete de Estreia: ${movieTitle}!`,
    )

    expect(interceptedEmailData.Content.Headers.To[0]).toEqual(targetEmail)
  })
})
