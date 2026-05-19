import { app } from '@/app'
import { registerBodySchema } from '@movie-challenge/core-types'
import z from 'zod'
import { register } from '../controllers/users/register'

export async function userRoutes() {
  app.post(
    '/users',
    {
      schema: {
        tags: ['Users'],
        summary: '/register',
        description: 'Create a new user account',
        body: registerBodySchema,
        response: {
          201: z.object({
            message: z.string().describe('User successfully created'),
          }),
          400: z.object({
            message: z.string().describe('Validation error'),
          }),
          409: z.object({
            message: z.string().describe('User already exists'),
          }),
        },
      },
    },
    register,
  )

  // app.get('/me', { onRequest: [verifyJWT], profile })
}
