import { PrismaMoviesRepository } from '@/repositories/prisma/movies-repository'
import { FetchMoviesUseCase } from '../movie/fetch-movies'

export function makeFetchMoviesUseCase() {
  const movieRepository = new PrismaMoviesRepository()
  return new FetchMoviesUseCase(movieRepository)
}
