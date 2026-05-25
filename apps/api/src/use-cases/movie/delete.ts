import { MovieRepository } from '@/repositories/movies-repository'
import { NotAllowedError } from '../errors/not-allowed'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface DeleteMovieUseCaseRequest {
  userId: string
  movieId: string
}

export class DeleteMovieUseCase {
  constructor(private movieRepository: MovieRepository) {}

  async execute({ userId, movieId }: DeleteMovieUseCaseRequest): Promise<void> {
    const movie = await this.movieRepository.findById(movieId)

    if (!movie) throw new ResourceNotFoundError()

    if (movie.user_id !== userId) throw new NotAllowedError()

    await this.movieRepository.delete(movieId)
  }
}
