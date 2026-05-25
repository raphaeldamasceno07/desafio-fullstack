import { MovieRepository } from '@/repositories/movies-repository'
import { Movie } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface GetMovieDetailsUseCaseRequest {
  slug: string
}

interface GetMovieDetailsUseCaseResponse {
  movie: Movie
}

export class GetMovieDetailsUseCase {
  constructor(private movieRepository: MovieRepository) {}

  async execute({
    slug,
  }: GetMovieDetailsUseCaseRequest): Promise<GetMovieDetailsUseCaseResponse> {
    const movie = await this.movieRepository.findBySlug(slug)

    if (!movie) {
      throw new ResourceNotFoundError()
    }

    return { movie }
  }
}
