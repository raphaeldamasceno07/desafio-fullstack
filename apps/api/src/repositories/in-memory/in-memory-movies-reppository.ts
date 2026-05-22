import { FindManyMoviesParams } from '@movie-challenge/core-types'
import { Movie } from '@prisma/client'
import {
  CreateMovieRepositoryData,
  MovieRepository,
} from '../movies-repository'

export class InMemoryMoviesRepository implements MovieRepository {
  public items: Movie[] = []

  async createMovie(data: CreateMovieRepositoryData): Promise<Movie> {
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

  async findMovieById(movieId: string): Promise<Movie | null> {
    const movie = this.items.find(item => item.id === movieId)
    return movie ?? null
  }

  async findMovieBySlug(slug: string): Promise<Movie | null> {
    const movie = this.items.find(item => item.slug === slug)
    return movie ?? null
  }

  async findManyMoviesByParams({
    search,
    genre,
    durationMax,
    releaseDateStart,
    releaseDateEnd,
    page,
  }: FindManyMoviesParams): Promise<Movie[]> {
    let filteredMovies = this.items

    if (search) {
      filteredMovies = filteredMovies.filter(
        movie =>
          movie.title.toLowerCase().includes(search.toLowerCase()) ||
          movie.original_title.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (genre) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.genre.toLowerCase().includes(genre.toLowerCase()),
      )
    }

    if (durationMax) {
      filteredMovies = filteredMovies.filter(
        movie => movie.duration <= durationMax,
      )
    }

    if (releaseDateStart) {
      const startDate = new Date(releaseDateStart)
      filteredMovies = filteredMovies.filter(
        movie => movie.release_date >= startDate,
      )
    }

    if (releaseDateEnd) {
      const endDate = new Date(releaseDateEnd)
      filteredMovies = filteredMovies.filter(
        movie => movie.release_date <= endDate,
      )
    }

    const startIndex = (page - 1) * 10
    const endIndex = startIndex * 10 + 10

    return filteredMovies.slice(startIndex, endIndex)
  }

  async updateMovie(movie: Movie): Promise<Movie> {
    const itemIndex = this.items.findIndex(item => item.id === movie.id)

    if (itemIndex >= 0) {
      this.items[itemIndex] = movie
    }

    return movie
  }
}
