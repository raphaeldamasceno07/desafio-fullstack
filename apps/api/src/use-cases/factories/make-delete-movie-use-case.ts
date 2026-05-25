import { PrismaMoviesRepository } from '@/repositories/prisma/movies-repository'
import { DeleteMovieUseCase } from '../movie/delete'

export function makeDeleteMovieUseCase() {
  const moviesRespository = new PrismaMoviesRepository()
  const useCase = new DeleteMovieUseCase(moviesRespository)

  return useCase
}
