import { makeDeleteMovieUseCase } from '@/use-cases/factories/make-delete-movie-use-case'
import { movieParamsSchema } from '@movie-challenge/core-types'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function deleteMovie(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = movieParamsSchema.parse(request.params)
  const userId = request.user.sub

  const deleteMovieUseCase = makeDeleteMovieUseCase()
  await deleteMovieUseCase.execute({ movieId: id, userId })

  return reply.status(204).send()
}
