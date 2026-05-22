import { PrismaMoviesRepository } from '@/repositories/prisma/prisma-movies-repository'
import { GetMovieDetailsUseCase } from '../movie/get-details'

export function makeGetMovieDetailsUseCase() {
  const moviesRespository = new PrismaMoviesRepository()
  const useCase = new GetMovieDetailsUseCase(moviesRespository)

  return useCase
}
