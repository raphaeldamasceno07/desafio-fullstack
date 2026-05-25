import { FakeMailProvider } from '@/providers/MailProvider/fakes/fake-mail-provider'
import { FakeStorageProvider } from '@/providers/StorageProvider/fakes/fake-storage-provider'
import { InMemoryMoviesRepository } from '@/repositories/in-memory/in-memory-movies-reppository'
import { MovieAlreadyExistsError } from '../errors/movie-already-exists'
import { CreateMovieUseCase } from './create'

let moviesRepository: InMemoryMoviesRepository
let mailProvider: FakeMailProvider
let storageProvider: FakeStorageProvider
let sut: CreateMovieUseCase

describe('Create Movie Use Case', () => {
  beforeEach(() => {
    moviesRepository = new InMemoryMoviesRepository()
    mailProvider = new FakeMailProvider()
    storageProvider = new FakeStorageProvider()

    sut = new CreateMovieUseCase(
      moviesRepository,
      mailProvider,
      storageProvider,
    )
  })

  it('should be able to create a movie without a poster', async () => {
    const { movie } = await sut.execute({
      userId: 'user-01',
      userEmail: 'raphael@example.com',
      title: 'Inception',
      original_title: 'Inception',
      description:
        'A thief who steals corporate secrets through the use of dream-sharing technology...',
      duration: 148,
      budget: 160000000,
      genre: 'Sci-Fi',
      release_date: '2010-07-16',
      file: undefined,
      popularity: 85.5,
      vote_count: 24000,
      rating: 8.8,
      status: 'Released',
      language: 'en',
      revenue: 836800000,
    })

    expect(movie.id).toEqual(expect.any(String))
    expect(movie.slug).toEqual('inception-2010')
    expect(movie.poster_url).toBeNull()
    expect(moviesRepository.items).toHaveLength(1)
    expect(moviesRepository.items[0].rating).toEqual(8.8)
    expect(moviesRepository.items[0].status).toEqual('Released')
  })

  it('should be able to create a movie WITH a poster image upload', async () => {
    const fakeFile = {
      name: 'avatar-poster.jpg',
      buffer: Buffer.from('fake-binary-image-data'),
      mimeType: 'image/jpeg',
    }

    const { movie } = await sut.execute({
      userId: 'user-01',
      userEmail: 'raphael@example.com',
      title: 'Interstellar',
      original_title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space...',
      duration: 169,
      budget: 165000000,
      genre: 'Sci-Fi',
      release_date: '2014-11-07',
      file: fakeFile,
      popularity: 92.1,
      vote_count: 18000,
      rating: 8.6,
      status: 'Released',
      language: 'en',
      revenue: 701700000,
    })

    expect(movie.id).toEqual(expect.any(String))
    expect(movie.poster_url).toContain('https://fake-bucket.s3.amazonaws.com')
    expect(moviesRepository.items[0].poster_url).toEqual(movie.poster_url)
    expect(moviesRepository.items[0].language).toEqual('en')
  })

  it('should not be able to create a movie with a duplicated slug', async () => {
    const moviePayload = {
      userId: 'user-01',
      userEmail: 'raphael@example.com',
      title: 'The Matrix',
      original_title: 'The Matrix',
      description:
        'A computer hacker learns from mysterious rebels about the true nature of his reality...',
      duration: 136,
      budget: 63000000,
      genre: 'Action',
      release_date: '1999-03-31',
      popularity: 78.4,
      vote_count: 31000,
      rating: 8.7,
      status: 'Released',
      language: 'en',
      revenue: 467200000,
    }

    await sut.execute(moviePayload)

    await expect(() =>
      sut.execute({
        ...moviePayload,
        userId: 'user-02',
      }),
    ).rejects.toBeInstanceOf(MovieAlreadyExistsError)
  })

  it('should schedule an email reminder if the movie release date is in the future', async () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 15)
    const futureDateString = futureDate.toISOString().split('T')[0]

    const { movie } = await sut.execute({
      userId: 'user-01',
      userEmail: 'raphael@example.com',
      title: 'Future Movie 2',
      original_title: 'Future Movie 2',
      description: 'Epic space opera coming soon...',
      duration: 150,
      budget: 200000000,
      genre: 'Adventure',
      release_date: futureDateString,
      popularity: 10.5,
      vote_count: 0,
      rating: 0,
      status: 'Post Production',
      language: 'en',
      revenue: 0,
    })

    expect(movie.id).toEqual(expect.any(String))
    expect(movie.status).toEqual('Post Production')

    expect(mailProvider.sentMails).toHaveLength(1)
    expect(mailProvider.sentMails[0].to).toEqual('raphael@example.com')
    expect(mailProvider.sentMails[0].sendAt).toEqual(new Date(futureDateString))
  })
})
