import { MailhogMailProvider } from '@/providers/MailProvider/mailhog-mail-provider'
import { CloudflareR2StorageProvider } from '@/providers/StorageProvider/implementations/cloudflare-r2-storage-provider' // ✅ Pasta certa: StorageProvider
import { PrismaMoviesRepository } from '@/repositories/prisma/movies-repository'
import { CreateMovieUseCase } from '../movie/create'

export function makeCreateMovieUseCase() {
  const moviesRepository = new PrismaMoviesRepository()
  const storageProvider = new CloudflareR2StorageProvider()
  const mailProvider = new MailhogMailProvider()

  const useCase = new CreateMovieUseCase(
    moviesRepository,
    mailProvider,
    storageProvider,
  )

  return useCase
}
