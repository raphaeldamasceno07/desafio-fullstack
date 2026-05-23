import { PrismaMoviesRepository } from '@/repositories/prisma/movies-repository'
import { UpdateMovieUseCase } from '../movie/update-movie'

export function makeUpdateMovieUseCase() {
  const movieRepository = new PrismaMoviesRepository()
  const useCase = new UpdateMovieUseCase(movieRepository)

  return useCase
}
