import { InMemoryMoviesRepository } from '@/repositories/in-memory/in-memory-movies-reppository'
import { NotAllowedError } from '../errors/not-allowed'
import { DeleteMovieUseCase } from './delete'

let moviesRepository: InMemoryMoviesRepository
let sut: DeleteMovieUseCase

describe('Delete Movies Use Case', () => {
  beforeEach(() => {
    moviesRepository = new InMemoryMoviesRepository()
    sut = new DeleteMovieUseCase(moviesRepository)
  })

  it('should be able to delete a movie', async () => {
    const createdMovies = []

    for (let i = 1; i <= 3; i++) {
      const movie = await moviesRepository.create({
        title: `Homem de Ferro ${i}`,
        original_title: 'Iron Man',
        description: 'Original description',
        duration: 120,
        budget: 100000000,
        genre: 'Ação',
        slug: `iron-man-${i}`,
        user_id: 'user-owner',
        poster_url: 'iron-man.webp',
        release_date: new Date('2008-05-02'),
      })

      createdMovies.push(movie)
    }

    const movieToDelete = createdMovies[1]

    await sut.execute({
      movieId: movieToDelete.id,
      userId: 'user-owner',
    })

    const remainingMovies = moviesRepository.items

    expect(remainingMovies).toHaveLength(2)
    expect(remainingMovies.some(m => m.id === movieToDelete.id)).toBe(false)
  })

  it('should not be able to delete a movie with another user', async () => {
    const createdMovies = []

    for (let i = 0; i <= 3; i++) {
      const movie = await moviesRepository.create({
        title: `Homem de Ferro ${i}`,
        original_title: 'Iron Man',
        description: 'Original description',
        duration: 120,
        budget: 100000000,
        genre: 'Ação',
        slug: `iron-man-${i}`,
        user_id: 'user-owner',
        poster_url: 'iron-man.webp',
        release_date: new Date('2008-05-02'),
      })

      createdMovies.push(movie)
    }

    const movieToDelete = createdMovies[1]

    await expect(
      sut.execute({
        movieId: movieToDelete.id,
        userId: 'user-hacker',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
