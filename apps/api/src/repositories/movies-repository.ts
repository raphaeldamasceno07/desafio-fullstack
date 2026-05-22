import {
  CreateMovieRequest,
  FindManyMoviesParams,
} from '@movie-challenge/core-types'
import { Movie } from '@prisma/client'

export type CreateMovieRepositoryData = Omit<
  CreateMovieRequest,
  'release_date' | 'poster_url'
> & {
  slug: string
  user_id: string
  release_date: Date
  poster_url: string | null
}

export interface MovieRepository {
  create(data: CreateMovieRepositoryData): Promise<Movie>
  findById(movieId: string): Promise<Movie | null>
  findBySlug(slug: string): Promise<Movie | null>
  findManyByParams(params: FindManyMoviesParams): Promise<Movie[]>
  save(movie: Movie): Promise<Movie>
}
