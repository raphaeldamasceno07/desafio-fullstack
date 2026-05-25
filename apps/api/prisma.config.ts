import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@db:5432/fullstack-challenge-db?schema=public',
  },
})
