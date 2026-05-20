import { Movie } from '@prisma/client'
import {
  CreateMovieRepositoryData,
  MovieRepository,
} from '../movies-repository'

export class InMemoryMoviesRepository implements MovieRepository {
  public items: Movie[] = []

  async findBySlug(slug: string): Promise<Movie | null> {
    const movie = this.items.find(item => item.slug === slug)
    return movie ?? null
  }

  async create(data: CreateMovieRepositoryData): Promise<Movie> {
    const newMovie: Movie = {
      id: crypto.randomUUID(),
      title: data.title,
      original_title: data.original_title,
      description: data.description,
      duration: data.duration,
      release_date: data.release_date,
      budget: data.budget,
      genre: data.genre,
      slug: data.slug,
      user_id: data.user_id,
      poster_url: data.poster_url,
      createdAt: new Date(),
    }

    this.items.push(newMovie)

    return newMovie
  }
}
