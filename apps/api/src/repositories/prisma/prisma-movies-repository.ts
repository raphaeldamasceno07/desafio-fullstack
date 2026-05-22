import { prisma } from '@/lib/prisma'
import { FindManyMoviesParams } from '@movie-challenge/core-types'
import { Movie, Prisma } from '@prisma/client'
import {
  CreateMovieRepositoryData,
  MovieRepository,
} from '../movies-repository'

export class PrismaMoviesRepository implements MovieRepository {
  async create(data: CreateMovieRepositoryData): Promise<Movie> {
    // 1. Criamos o objeto de input tipado estritamente para o Prisma
    const movieDataInput: Prisma.MovieCreateInput = {
      title: data.title,
      original_title: data.original_title,
      description: data.description,
      duration: data.duration,
      budget: data.budget,
      genre: data.genre,
      release_date: data.release_date,
      slug: data.slug,
      poster_url: data.poster_url, // 👈 O TypeScript agora vai correlcionar perfeitamente com o schema.prisma
      user: {
        connect: { id: data.user_id }, // Usar o connect é a boa prática da Clean Architecture com Prisma para chaves estrangeiras
      },
    }

    const movie = await prisma.movie.create({
      data: movieDataInput,
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
        createdAt: 'desc',
      },
    })

    return movies
  }
}
