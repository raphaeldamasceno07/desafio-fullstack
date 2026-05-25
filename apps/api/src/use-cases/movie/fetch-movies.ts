import { MovieRepository } from '@/repositories/movies-repository'
import { Movie } from '@prisma/client'

interface FetchMoviesParamsUseCaseRequest {
  search?: string
  genre?: string
  durationMax?: number
  releaseDateStart?: string
  releaseDateEnd?: string
  page?: number
}

interface FetchMoviesUseCaseResponse {
  movies: Movie[]
}

export class FetchMoviesUseCase {
  constructor(private movieRepository: MovieRepository) {}

  async execute({
    search,
    genre,
    durationMax,
    releaseDateStart,
    releaseDateEnd,
    page = 1,
  }: FetchMoviesParamsUseCaseRequest): Promise<FetchMoviesUseCaseResponse> {
    const currentPage = Math.max(1, page)

    const movies = await this.movieRepository.findManyByParams({
      search,
      genre,
      durationMax,
      releaseDateStart,
      releaseDateEnd,
      page: currentPage,
    })

    return { movies }
  }
}
