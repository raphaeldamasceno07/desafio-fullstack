import { InMemoryMoviesRepository } from '@/repositories/in-memory/in-memory-movies-reppository'
import { NotAllowedError } from '../errors/not-allowed'
import { UpdateMovieUseCase } from './update-movie'

let moviesRepository: InMemoryMoviesRepository
let sut: UpdateMovieUseCase

describe('Update Movie Use Case', () => {
  beforeEach(() => {
    moviesRepository = new InMemoryMoviesRepository()
    sut = new UpdateMovieUseCase(moviesRepository)
  })

  it('should be able to update a movie', async () => {
    const originalMovie = await moviesRepository.create({
      title: 'Homem de Ferro',
      original_title: 'Iron Man',
      description: 'Original description',
      duration: 120,
      budget: 100000000,
      genre: 'Ação',
      slug: 'iron-man',
      user_id: 'user-owner',
      poster_url: 'iron-man.webp',
      release_date: new Date('2008-05-02'),
    })

    const { movie } = await sut.execute({
      userId: 'user-owner',
      movieId: originalMovie.id,
      title: 'Homem de Ferro - Atualizado',
      original_title: 'Iron Man v2',
      description: 'New updated description',
      duration: 130,
      budget: 120000000,
      genre: 'Ação, Ficção',
    })

    expect(movie.title).toEqual('Homem de Ferro - Atualizado')
    expect(movie.duration).toEqual(130)
  })

  it('should not be able to update a movie from another user', async () => {
    const originalMovie = await moviesRepository.create({
      title: 'Matrix',
      original_title: 'The Matrix',
      description: 'Blue or red pill?',
      duration: 136,
      budget: 60000000,
      genre: 'Ficção',
      slug: 'matrix',
      user_id: 'user-owner',
      poster_url: 'the-matrix.webp',
      release_date: new Date('1999-03-31'),
    })

    await expect(() =>
      sut.execute({
        userId: 'user-hacker',
        movieId: originalMovie.id,
        title: 'Matrix Hackeado',
        original_title: 'The Matrix Hacked',
        description: 'Bypassing security.',
        duration: 136,
        budget: 60000000,
        genre: 'Ficção',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
