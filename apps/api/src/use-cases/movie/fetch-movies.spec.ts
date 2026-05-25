import { InMemoryMoviesRepository } from '@/repositories/in-memory/in-memory-movies-reppository'
import { FetchMoviesUseCase } from './fetch-movies'

let movieRepository: InMemoryMoviesRepository
let sut: FetchMoviesUseCase

describe('Fetch Movies Use Case (Unit)', () => {
  beforeEach(() => {
    movieRepository = new InMemoryMoviesRepository()
    sut = new FetchMoviesUseCase(movieRepository)
  })

  it('should be able to fetch a list of movies with pagination', async () => {
    for (let i = 1; i <= 22; i++) {
      await movieRepository.create({
        title: `Movie ${i}`,
        original_title: `Original Movie ${i}`,
        description: `Description ${i}`,
        duration: 120,
        release_date: new Date('2026-05-20'),
        budget: 1000000,
        genre: 'Ação',
        slug: `movie-${i}`,
        user_id: 'user-01',
        poster_url: null,
      })
    }

    const { movies } = await sut.execute({ page: 3 })

    expect(movies).toHaveLength(2)
    expect(movies[0].title).toEqual('Movie 21')
    expect(movies[1].title).toEqual('Movie 22')
  })

  it('should be able to search movies dynamically by title', async () => {
    await movieRepository.create({
      title: `Avatar: The Way of Water`,
      original_title: `Avatar 2`,
      description: `Pandora world`,
      duration: 190,
      release_date: new Date('2026-01-01'),
      budget: 300000000,
      genre: 'Ficção',
      slug: 'avatar-2',
      user_id: 'user-01',
      poster_url: null,
    })

    await movieRepository.create({
      title: `The Matrix`,
      original_title: `Matrix`,
      description: `Neo's world`,
      duration: 136,
      release_date: new Date('1999-03-31'),
      budget: 63000000,
      genre: 'Ficção',
      slug: 'matrix',
      user_id: 'user-01',
      poster_url: null,
    })

    const { movies } = await sut.execute({ search: 'avatar', page: 1 })

    expect(movies).toHaveLength(1)
    expect(movies[0].title).toEqual('Avatar: The Way of Water')
  })

  it('should be able to filter movies by duration, genre and release date period', async () => {
    await movieRepository.create({
      title: 'Target Movie',
      original_title: 'Target',
      description: 'Match terms',
      duration: 110,
      release_date: new Date('2026-06-15'),
      budget: 500000,
      genre: 'Drama',
      slug: 'target-movie',
      user_id: 'user-01',
      poster_url: null,
    })

    await movieRepository.create({
      title: 'Wrong Genre',
      original_title: 'Wrong 1',
      description: 'No match',
      duration: 100,
      release_date: new Date('2026-06-15'),
      budget: 500000,
      genre: 'Comédia',
      slug: 'wrong-genre',
      user_id: 'user-01',
      poster_url: null,
    })

    await movieRepository.create({
      title: 'Too Long Movie',
      original_title: 'Wrong 2',
      description: 'No match',
      duration: 150,
      release_date: new Date('2026-06-15'),
      budget: 500000,
      genre: 'Drama',
      slug: 'too-long-movie',
      user_id: 'user-01',
      poster_url: null,
    })

    const { movies } = await sut.execute({
      genre: 'Drama',
      durationMax: 120,
      releaseDateStart: '2026-06-01',
      releaseDateEnd: '2026-06-30',
      page: 1,
    })

    expect(movies).toHaveLength(1)
    expect(movies[0].title).toEqual('Target Movie')
  })
})
