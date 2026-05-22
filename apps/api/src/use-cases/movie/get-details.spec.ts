import { InMemoryMoviesRepository } from '@/repositories/in-memory/in-memory-movies-reppository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { GetMovieDetailsUseCase } from './get-details'

let moviesRepository: InMemoryMoviesRepository
let sut: GetMovieDetailsUseCase

describe('Get Movie Details Use Case', () => {
  beforeEach(() => {
    moviesRepository = new InMemoryMoviesRepository()
    sut = new GetMovieDetailsUseCase(moviesRepository)
  })

  it('should be able to get movie details by slug', async () => {
    await moviesRepository.create({
      title: 'Homem de Ferro',
      original_title: 'Iron Man',
      description: 'Tony Stark builds an armor.',
      duration: 126,
      release_date: new Date('2008-05-02'),
      budget: 140000000,
      genre: 'Ação',
      slug: 'iron-man-2008',
      user_id: 'user-01',
      poster_url: 'iron-man.webp',
    })

    const { movie } = await sut.execute({
      slug: 'iron-man-2008',
    })

    console.log(movie.slug)

    expect(movie.id).toEqual(expect.any(String))
    expect(movie.title).toEqual('Homem de Ferro')
    expect(movie.original_title).toEqual('Iron Man')
  })

  it('should not be able to get movie details with non-existing slug', async () => {
    await expect(() =>
      sut.execute({
        slug: 'non-existing-slug',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
