import {
  createMovieBodySchema,
  fetchMoviesQuerySchema,
  updateMovieBodySchema,
  updateMovieParamsSchema,
} from '@movie-challenge/core-types'
import { FastifyInstance } from 'fastify'
import z from 'zod'
import { createMovie } from '../controllers/movies/create'
import { fetchMovies } from '../controllers/movies/fetch-movies'
import { getMovieDetails } from '../controllers/movies/get-movie-details'
import { updateMovie } from '../controllers/movies/update-movie'
import { verifyJWT } from '../middlewares/verify-jwt'

export async function movieRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post(
    '/movies',
    {
      schema: {
        tags: ['Movies'],
        summary: 'Create a movie',
        description: 'Upload a movie',
        consumes: ['multipart/form-data'],
        body: createMovieBodySchema,
        response: {
          201: z.object({
            movie: z.object({
              id: z.string(),
              poster_url: z.string().url().nullable(),
              title: z.string(),
              original_title: z.string(),
              description: z.string(),
              duration: z.number(),
              release_date: z.coerce.string(),
              budget: z.number(),
              genre: z.string(),
              slug: z.string(),
              user_id: z.string(),
              createdAt: z.any(),
            }),
          }),
          400: z.object({ message: z.string().describe('Validation error') }),
          401: z.object({
            message: z.string().describe('Unauthorized access'),
          }),
        },
      },
      validatorCompiler: () => () => true,
    },
    createMovie,
  )

  app.get(
    '/movies',
    {
      schema: {
        tags: ['Movies'],
        summary: 'List movies',
        description:
          'Fetch all movies with support for pagination, full-text search, and specific filters.',
        querystring: fetchMoviesQuerySchema,
      },
    },
    fetchMovies,
  )

  app.get(
    '/movies/slug/:slug',
    {
      schema: {
        tags: ['Movies'],
        summary: 'Get movie details by slug',
        description:
          'Fetch all detailed information of a single movie using its unique slug.',
        params: z.object({
          slug: z.string().describe('The unique slug of the movie'),
        }),
      },
    },
    getMovieDetails,
  )

  app.put(
    '/movies/:id',
    {
      schema: {
        tags: ['Movies'],
        summary: 'Update a movie',
        description: 'Allows the creator of the movie to update its details.',
        params: updateMovieParamsSchema,
        body: updateMovieBodySchema,
      },
    },
    updateMovie,
  )
}
