import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeGetMovieDetailsUseCase } from '@/use-cases/factories/make-get-movie-details-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function getMovieDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getMovieDetailsParamsSchema = z.object({
    slug: z.string(),
  })

  const { slug } = getMovieDetailsParamsSchema.parse(request.params)

  try {
    const getMovieDetailsUseCase = makeGetMovieDetailsUseCase()

    const { movie } = await getMovieDetailsUseCase.execute({ slug })

    return reply.status(200).send({ movie })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
