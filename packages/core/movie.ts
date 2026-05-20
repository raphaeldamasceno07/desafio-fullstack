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
