import { prisma } from '@/lib/prisma'
import { FindManyMoviesParams } from '@movie-challenge/core-types'
import { Movie } from '@prisma/client'
import {
  CreateMovieRepositoryData,
  MovieRepository,
} from '../movies-repository'

export class PrismaMoviesRepository implements MovieRepository {
  async create(data: CreateMovieRepositoryData): Promise<Movie> {
    const movie = await prisma.movie.create({
      data: {
        title: data.title,
        original_title: data.original_title,
        description: data.description,
        duration: data.duration,
        budget: data.budget,
        genre: data.genre,
        release_date: data.release_date,
        slug: data.slug,
        poster_url: data.poster_url,
        popularity: data.popularity,
        vote_count: data.vote_count,
        rating: data.rating,
        status: data.status,
        language: data.language,
        revenue: data.revenue,
        user: {
          connect: { id: data.user_id },
        },
      },
    })

    return movie
  }
  async findById(movieId: string): Promise<Movie | null> {
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    })

    return movie
  }

  async findBySlug(slug: string): Promise<Movie | null> {
    const movie = await prisma.movie.findUnique({
      where: { slug },
    })

    return movie
  }

  async findManyByParams({
    search,
    genre,
    durationMax,
    releaseDateStart,
    releaseDateEnd,
    page,
  }: FindManyMoviesParams): Promise<Movie[]> {
    const searchFilter = search?.trim() ? search : undefined
    const genreFilter = genre?.trim() ? genre : undefined
    const durationFilter = durationMax || undefined

    const hasValidStartDate =
      typeof releaseDateStart === 'string' && releaseDateStart.trim() !== ''
    const hasValidEndDate =
      typeof releaseDateEnd === 'string' && releaseDateEnd.trim() !== ''

    const movies = await prisma.movie.findMany({
      where: {
        ...(searchFilter
          ? {
              OR: [
                { title: { contains: searchFilter, mode: 'insensitive' } },
                {
                  original_title: {
                    contains: searchFilter,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),

        genre: genreFilter
          ? { contains: genreFilter, mode: 'insensitive' }
          : undefined,
        duration: durationFilter ? { lte: durationFilter } : undefined,

        release_date:
          hasValidStartDate || hasValidEndDate
            ? {
                gte: hasValidStartDate
                  ? new Date(`${releaseDateStart.trim()}T00:00:00.000Z`)
                  : undefined,
                lte: hasValidEndDate
                  ? new Date(`${releaseDateEnd.trim()}T23:59:59.999Z`)
                  : undefined,
              }
            : undefined,
      },
      take: 10,
      skip: (page - 1) * 10,
      orderBy: {
        id: 'desc',
      },
    })

    return movies
  }

  async save(movie: Movie): Promise<Movie> {
    const updateMovie = await prisma.movie.update({
      where: { id: movie.id },
      data: movie,
    })
    return updateMovie
  }

  async delete(movieId: string): Promise<void> {
    await prisma.movie.delete({
      where: { id: movieId },
    })
  }
}
