import { MovieRepository } from '@/repositories/movies-repository'
import { Movie } from '@prisma/client'
import { NotAllowedError } from '../errors/not-allowed'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface UpdateMovieUseCaseRequest {
  userId: string
  movieId: string
  title: string
  original_title: string
  description: string
  duration: number
  budget: number
  genre: string
}

interface UpdateMovieUseCaseResponse {
  movie: Movie
}

export class UpdateMovieUseCase {
  constructor(private movieRepository: MovieRepository) {}

  async execute({
    userId,
    movieId,
    title,
    original_title,
    description,
    duration,
    budget,
    genre,
  }: UpdateMovieUseCaseRequest): Promise<UpdateMovieUseCaseResponse> {
    const movie = await this.movieRepository.findById(movieId)

    if (!movie) {
      throw new ResourceNotFoundError()
    }

    if (movie.user_id !== userId) {
      throw new NotAllowedError()
    }

    movie.title = title
    movie.original_title = original_title
    movie.description = description
    movie.duration = duration
    movie.budget = budget
    movie.genre = genre

    const updatedMovie = await this.movieRepository.save(movie)

    return { movie: updatedMovie }
  }
}
