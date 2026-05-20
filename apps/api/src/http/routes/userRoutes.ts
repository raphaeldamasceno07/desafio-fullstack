import { app } from '@/app'
import { registerBodySchema } from '@movie-challenge/core-types'
import z from 'zod'
import { profile } from '../controllers/users/profile'
import { register } from '../controllers/users/register'
import { verifyJWT } from '../middlewares/verify-jwt'

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

  //precisa de autenticação para acessar as rotas abaixo
  app.get(
    '/me',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['Users'],
        summary: 'Get user profile',
        description:
          'Retrieve the profile information of the authenticated user',
        response: {
          200: z.object({
            id: z.string().describe('User ID'),
            name: z.string().describe('User name'),
            email: z.string().describe('User email'),
            createdAt: z.string().describe('Account creation date'),
          }),
          401: z.object({
            message: z.string().describe('Unauthorized access'),
          }),
          404: z.object({
            message: z.string().describe('Resource not found.'),
          }),
        },
      },
    },
    profile,
  )
}
