import { makeFetchMoviesUseCase } from '@/use-cases/factories/make-fetch-movies-use-case'
import { fetchMoviesQuerySchema } from '@movie-challenge/core-types'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchMovies(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const queryData = fetchMoviesQuerySchema.parse(request.query)

  const search = queryData.search?.trim() || undefined
  const genre = queryData.genre?.trim() || undefined
  const durationMax = queryData.durationMax || undefined
  const releaseDateStart = queryData.releaseDateStart?.trim() || undefined
  const releaseDateEnd = queryData.releaseDateEnd?.trim() || undefined
  const page = queryData.page

  const fetchMoviesUseCase = makeFetchMoviesUseCase()

  const { movies } = await fetchMoviesUseCase.execute({
    search,
    genre,
    durationMax,
    releaseDateStart,
    releaseDateEnd,
    page,
  })

  return reply.status(200).send({ movies })
}
