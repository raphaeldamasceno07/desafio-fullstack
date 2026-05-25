import { MailProvider } from '@/providers/MailProvider/mail-provider'
import { StorageProvider } from '@/providers/StorageProvider/storage-provider'
import { MovieRepository } from '@/repositories/movies-repository'
import { generateSlug } from '@/utils/genetate'
import { Movie } from '@prisma/client'
import { MovieAlreadyExistsError } from '../errors/movie-already-exists'

interface CreateMovieUseCaseRequest {
  userId: string
  userEmail: string
  title: string
  original_title: string
  description: string
  duration: number
  release_date: string
  budget: number
  genre: string
  file?: {
    name: string
    buffer: Buffer
    mimeType: string
  }
  popularity?: number
  vote_count?: number
  rating?: number
  status?: string
  language?: string
  revenue?: number
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

    if (movieWithSameSlug) throw new MovieAlreadyExistsError()

    let posterUrl: string | null = null

    if (data.file) {
      const uniqueFileName = `${slug}-${data.file.name}`

      posterUrl = await this.storageProvider.upload(
        uniqueFileName,
        data.file.buffer,
        data.file.mimeType,
      )
    }

    // 🌟 Repassando os novos campos opcionais para o repositório
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
      popularity: data.popularity ?? 0,
      vote_count: data.vote_count ?? 0,
      rating: data.rating ?? 0,
      status: data.status ?? 'Released',
      language: data.language ?? 'en',
      revenue: data.revenue ?? 0,
    })

    await this.mailProvider.sendMail({
      to: data.userEmail,
      subject: `Lembrete de Estreia: ${data.title}!`,
      body: `Olá! O filme "${data.title}" está estreando hoje!`,
      sendAt: releaseDate,
    })

    return { movie }
  }
}
