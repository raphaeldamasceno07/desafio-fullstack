import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { MailhogMailProvider } from '@/providers/MailProvider/mailhog-mail-provider'
import { CloudflareR2StorageProvider } from '@/providers/StorageProvider/implementations/cloudflare-r2-storage-provider'
import { hash } from 'bcryptjs'
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
    console.log(
      '\n------------------------------------------------------------',
    )
    console.log('🎬 [TEST 1] Iniciando criação de filme com pôster...')

    const uniqueEmail = `johndoe-${crypto.randomUUID()}@example.com`

    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: uniqueEmail,
        password_hash: await hash('123456', 6),
      },
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: uniqueEmail,
      password: '123456',
    })

    const { token } = authResponse.body

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

    console.log(
      `✅ Status retornado pela API no Teste 1: ${response.statusCode}`,
    )

    expect(response.statusCode).toEqual(201)
    expect(response.body.movie).toHaveProperty('id')
    expect(response.body.movie.title).toEqual(movieTitle)
    expect(response.body.movie.poster_url).toContain('test-poster.jpg')

    const movieOnDatabase = await prisma.movie.findUnique({
      where: { id: response.body.movie.id },
    })

    expect(movieOnDatabase).toBeTruthy()
    console.log('🎉 [TEST 1] Sucesso!')
    console.log('------------------------------------------------------------')
  })

  it('should schedule an email reminder when creating a movie with a future release date', async () => {
    // 💡 SOLUÇÃO: Deleta e limpa qualquer valor antigo para forçar o 'localhost' padrão
    delete process.env.SMTP_HOST

    console.log(
      '\n------------------------------------------------------------',
    )
    console.log('🚀 [TEST 2] Iniciando fluxo de filme futuro + Mailhog...')

    // Reseta a interceptação para garantir o isolamento do teste
    interceptedEmailData = null

    // ... restante do seu código continua exatamente idêntico
    // 💡 AQUI ESTÁ O SEGREDO: Moca apenas o Date, deixando a rede e o sleep() livres
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-01-01T12:00:00Z'))
    console.log(
      `⏱️ [TIME MOCK] Relógio do sistema travado em: ${new Date().toISOString()}`,
    )

    const targetEmail = `cinefilo-${crypto.randomUUID()}@example.com`

    await prisma.user.create({
      data: {
        name: 'Raphael Test',
        email: targetEmail,
        password_hash: await hash('123456', 6),
      },
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: targetEmail,
      password: '123456',
    })

    const { token } = authResponse.body

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

    console.log(
      `✅ Status retornado pela API no Teste 2: ${response.statusCode}`,
    )
    expect(response.statusCode).toEqual(201)

    // Devolve o controle total ao Node
    vi.useRealTimers()

    console.log(
      '📬 [4/4] Validando e-mail interceptado com sucesso da memória local...',
    )

    // 💡 AQUI ESTÁ A MÁGICA: Em vez de usar o for/fetch, lemos o mock direto!
    expect(interceptedEmailData).toBeTruthy()

    expect(interceptedEmailData.Content.Headers.Subject[0]).toEqual(
      `Lembrete de Estreia: ${movieTitle}!`,
    )

    expect(interceptedEmailData.Content.Headers.To[0]).toEqual(targetEmail)

    console.log('🎉 [TEST 2] Sucesso! Tudo concluído.')
    console.log(
      '------------------------------------------------------------\n',
    )
  })
})
