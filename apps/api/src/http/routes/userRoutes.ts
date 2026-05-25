import {
  registerBodySchema,
  updateUserBodySchema,
} from '@movie-challenge/core-types'
import { FastifyInstance } from 'fastify'
import z from 'zod'
import { remove } from '../controllers/users/delete'
import { profile } from '../controllers/users/profile'
import { register } from '../controllers/users/register'
import { update } from '../controllers/users/update'
import { verifyJWT } from '../middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.post(
    '/users',
    {
      schema: {
        tags: ['Users'],
        summary: 'Create a user',
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

  app.patch(
    '/me',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['Users'],
        summary: 'Update authenticated user profile',
        description:
          'Update the authenticated user profile. At least one field is required.',
        body: updateUserBodySchema,
        response: {
          200: z.object({
            id: z.string().describe('User ID'),
            name: z.string().describe('User name'),
            email: z.string().describe('User email'),
            createdAt: z.string().describe('Account creation date'),
          }),
          400: z.object({
            message: z.string().describe('Validation error'),
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
    update,
  )

  app.delete(
    '/me',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['Users'],
        summary: 'Delete authenticated user',
        description: 'Delete the authenticated user account.',
        response: {
          204: z.null(),
          401: z.object({
            message: z.string().describe('Unauthorized access'),
          }),
          404: z.object({
            message: z.string().describe('Resource not found.'),
          }),
        },
      },
    },
    remove,
  )
}
