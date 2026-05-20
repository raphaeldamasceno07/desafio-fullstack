import { MailProvider } from '@/providers/MailProvider/mail-provider'
import { StorageProvider } from '@/providers/StorageProvider/storage-provider'
import { MovieRepository } from '@/repositories/movies-repository' // 🚀 Interface genérica!
import { generateSlug } from '@/utils/genetate'
import { CreateMovieRequest } from '@movie-challenge/core-types'
import { Movie } from '@prisma/client'
import { MovieAlreadyExistsError } from '../errors/movie-already-exists'

interface CreateMovieUseCaseRequest extends CreateMovieRequest {
  userId: string
  userEmail: string
  file?: {
    name: string
    buffer: Buffer
    mimeType: string
  }
}

interface CreateMovieUseCaseResponse {
  movie: Movie
}

export class CreateMovieUseCase {
  constructor(
    private moviesRepository: MovieRepository,
    private mailProvider: MailProvider,
    private storageProvider: StorageProvider,
  ) {}

  async execute(
    data: CreateMovieUseCaseRequest,
  ): Promise<CreateMovieUseCaseResponse> {
    const releaseDate = new Date(data.release_date)
    const slug = generateSlug(data.original_title, releaseDate)

    const movieWithSameSlug = await this.moviesRepository.findBySlug(slug)
    if (movieWithSameSlug) {
      throw new MovieAlreadyExistsError()
    }

    let posterUrl: string | null = null

    if (data.file) {
      posterUrl = await this.storageProvider.upload(
        `${slug}-poster`,
        data.file.buffer,
        data.file.mimeType,
      )
    }

    const movie = await this.moviesRepository.create({
      slug,
      title: data.title,
      original_title: data.original_title,
      description: data.description,
      duration: data.duration,
      release_date: releaseDate,
      budget: data.budget,
      genre: data.genre,
      user_id: data.userId,
      poster_url: posterUrl,
    })

    const today = new Date()
    if (releaseDate > today) {
      await this.mailProvider.sendMail({
        to: data.userEmail,
        subject: `Lembrete de Estreia: ${data.title}!`,
        body: `Olá! O filme "${data.title}" está estreando hoje!`,
        sendAt: releaseDate,
      })
    }

    return { movie }
  }
}
