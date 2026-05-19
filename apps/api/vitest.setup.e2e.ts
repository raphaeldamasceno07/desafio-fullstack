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
    execSync('npx prisma db push --accept-data-loss', {
      stdio: 'pipe',
      env: process.env,
    })
    console.log('🚀 Database schema synced successfully! Starting tests...')
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
