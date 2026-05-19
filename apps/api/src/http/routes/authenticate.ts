import { authenticateBodySchema } from '@movie-challenge/core-types'
import { FastifyInstance } from 'fastify'
import z from 'zod'
import { session } from '../controllers/sessions/authenticate'
import { refresh } from '../controllers/sessions/refresh'

export async function sessionRoutes(app: FastifyInstance) {
  app.post(
    '/sessions',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Authenticate user',
        description: 'Authenticate a user with email and password',
        body: authenticateBodySchema,
        response: {
          200: z.object({
            token: z.string().describe('Authentication token'),
          }),
          400: z.object({
            message: z.string().describe('Validation error'),
          }),
          401: z.object({
            message: z.string().describe('Invalid credentials'),
          }),
        },
      },
    },
    session,
  )

  app.patch(
    '/token/refresh',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Refresh authentication token',
        description:
          'Refresh the authentication token using a valid refresh token',
        response: {
          200: z.object({
            token: z.string().describe('New authentication token'),
          }),
          401: z.object({
            message: z.string().describe('Invalid or expired refresh token'),
          }),
        },
      },
    },
    refresh,
  )
}
