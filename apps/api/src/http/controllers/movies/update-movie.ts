import { NotAllowedError } from '@/use-cases/errors/not-allowed'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeUpdateMovieUseCase } from '@/use-cases/factories/make-update-movie'
import {
  updateMovieBodySchema,
  updateMovieParamsSchema,
} from '@movie-challenge/core-types'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function updateMovie(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateMovieParamsSchema.parse(request.params)
  const data = updateMovieBodySchema.parse(request.body)
  const userId = request.user.sub

  try {
    const updateMovieUseCase = makeUpdateMovieUseCase()

    const { movie } = await updateMovieUseCase.execute({
      movieId: id,
      userId,
      ...data,
    })

    return reply.status(200).send({ movie })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof NotAllowedError) {
      return reply.status(403).send({ message: err.message })
    }

    throw err
  }
}
