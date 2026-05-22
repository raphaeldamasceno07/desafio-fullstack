import z from 'zod'

export interface CreateMovieRequest {
  poster_url?: string
  title: string
  original_title: string
  description: string
  duration: number
  release_date: string
  budget: number
  genre: string
}

export const createMovieBodySchema = z.object({
  title: z.string(),
  original_title: z.string().optional(),
  description: z.string(),
  release_date: z.coerce.string(),
  duration: z.coerce.number(),
  budget: z.coerce.number(),
  genre: z.string().optional(),
  file: z.any().optional(),
})

export const fetchMoviesQuerySchema = z.object({
  search: z.string().optional(),
  genre: z.string().optional(),
  durationMax: z.coerce.number().optional(),
  releaseDateStart: z
    .string()
    .optional()
    .transform(val => (val === '' ? undefined : val)),
  releaseDateEnd: z
    .string()
    .optional()
    .transform(val => (val === '' ? undefined : val)),
  page: z.coerce.number().min(1).default(1),
})

export type FindManyMoviesParams = z.infer<typeof fetchMoviesQuerySchema>

export interface MovieResponse {
  id: string
  poster_url?: string
  title: string
  original_title: string
  description: string
  duration: number
  release_date: string
  budget: number
  genre: string
  slug: string
  user_id: string
  createdAt: string
}

export interface CreateMovieResponse {
  movie: MovieResponse
}

export const updateMovieParamsSchema = z.object({
  id: z.string().uuid(),
})

export const updateMovieBodySchema = z.object({
  title: z.string(),
  original_title: z.string(),
  description: z.string(),
  duration: z.coerce.number(),
  budget: z.coerce.number(),
  genre: z.string(),
})
