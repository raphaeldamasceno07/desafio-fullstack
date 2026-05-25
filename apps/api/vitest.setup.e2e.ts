import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'
import { execSync } from 'node:child_process'

let container: StartedPostgreSqlContainer

export async function setup() {
  console.log('\n🚀 Starting PostgreSQL Testcontainer...')

  container = await new PostgreSqlContainer('postgres:15')
    .withDatabase('movie_challenge_test')
    .withUsername('raphael')
    .withPassword('mysecretpassword')
    .start()

  const uri = container.getConnectionUri()

  process.env.DATABASE_URL = uri
  process.env.NODE_ENV = 'test'
  process.env.JWT_SECRET_TEST = 'test-jwt-secret-key-for-testing-purposes'

  const { env } = await import('../api/src/env')

  try {
    ;(env as any).DATABASE_URL = uri
  } catch (e) {
    console.error(e)
  }

  console.log(`✅ Test Database ready at: ${uri}`)
  console.log('🔄 Syncing Schema with Test Database using DB Push...')

  try {
    // 1. Executa o push com o objeto de configuração fechando certinho
    execSync('npx prisma db push --accept-data-loss', {
      stdio: 'pipe',
      env: {
        ...process.env,
        DATABASE_URL: uri,
      },
    })
    console.log('🚀 Database schema synced successfully!')

    // 2. Importa e força a reconexão da API para limpar o pool antigo
    const { prisma } = await import('./src/lib/prisma') // 🌟 Garanta que este caminho aponta certinho para o seu arquivo da lib do prisma

    await prisma.$disconnect()
    await prisma.$connect()

    console.log(
      '🔌 [Prisma Client] Conectado ao Testcontainer com sucesso! Iniciando testes...',
    )
  } catch (error: any) {
    console.error(
      '\n❌ [Prisma DB Push Error]: Failed to sync schema to Testcontainer:',
    )
    if (error.stdout || error.stderr) {
      console.error(error.stdout?.toString())
      console.error(error.stderr?.toString())
    } else {
      console.error(error.message)
    }

    if (container) await container.stop()
    process.exit(1)
  }
}

export async function teardown() {
  if (container) {
    await container.stop()
    console.log('🛑 Testcontainer stopped and removed.')
  }
}
