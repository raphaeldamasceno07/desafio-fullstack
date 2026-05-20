import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  CLOUDFLARE_ENDPOINT: z.string().url().optional(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().optional(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().optional(),
  CLOUDFLARE_BUCKET_NAME: z.string().optional(),
  CLOUDFLARE_PUBLIC_URL: z.string().url().optional(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables:', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
