import z from 'zod'

// ============================================================================
// ############################## BACKEND SECTOR ##############################
// ============================================================================

// 🛡️ Schemas de Validação do Fastify (Zod)
export const createMovieBodySchema = z.object({
  title: z.string(),
  original_title: z.string().default(''),
  description: z.string(),
  release_date: z.coerce.string(),
  duration: z.coerce.number(),
  budget: z.coerce.number(),
  genre: z.string().default(''),
  file: z.any().optional(),

  // 🌟 NOVOS CAMPOS DO FIGMA: Validações para a rota POST /movies
  popularity: z.coerce.number().optional().default(0.0),
  vote_count: z.coerce.number().optional().default(0),
  rating: z.coerce.number().optional().default(0.0),
  status: z.string().optional().default('Lançado'),
  language: z.string().optional().default('Inglês'),
  revenue: z.coerce.number().optional().default(0.0),
})

export const updateMovieBodySchema = z.object({
  title: z.string(),
  original_title: z.string(),
  description: z.string(),
  duration: z.coerce.number(),
  budget: z.coerce.number(),
  genre: z.string(),

  // 🌟 NOVOS CAMPOS DO FIGMA: Permitir atualização também na rota PUT /movies/:id
  popularity: z.coerce.number().optional(),
  vote_count: z.coerce.number().optional(),
  rating: z.coerce.number().optional(),
  status: z.string().optional(),
  language: z.string().optional(),
  revenue: z.coerce.number().optional(),
})

export const movieParamsSchema = z.object({
  id: z.string().uuid(),
})

// 🔍 Query Params do Filtro Avançado (GET /movies)
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

// ============================================================================
// ############################# FRONTEND SECTOR ##############################
// ============================================================================

// 📨 Interfaces de Requests e Responses para o seu Axios consumirem no Next.js
export interface CreateMovieRequest {
  poster_url?: string
  title: string
  original_title: string
  description: string
  duration: number
  release_date: string
  budget: number
  genre: string

  // 🌟 NOVOS CAMPOS DO FIGMA: repassados no payload do formulário
  popularity?: number
  vote_count?: number
  rating?: number
  status?: string
  language?: string
  revenue?: number
}

export interface MovieResponse {
  id: string
  slug: string
  poster_url?: string
  title: string
  original_title: string
  description: string
  duration: number
  release_date: string
  budget: number
  genre: string
  user_id: string
  createdAt: string
  popularity: number
  vote_count: number
  rating: number
  status: string
  language: string
  revenue: number
  profit: number // Lucro calculado ou retornado diretamente da tabela
}

export interface CreateMovieResponse {
  movie: MovieResponse
}
