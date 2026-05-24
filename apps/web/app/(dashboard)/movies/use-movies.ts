import { api } from '@/services/api'
import { MovieResponse } from '@movie-challenge/core-types'
import { useEffect, useState } from 'react'

export function useMovies() {
  const [movies, setMovies] = useState<MovieResponse[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [extraFilters, setExtraFilters] = useState<any>({})
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const ITEMS_PER_PAGE = 10
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(handler)
  }, [search])

  async function loadMovies() {
    setIsLoading(true)
    try {
      const response = await api.get('/movies', {
        params: {
          search: debouncedSearch?.trim() || undefined,
          page,
          // 🌟 Espalha os filtros do modal direto nos parâmetros da URL da API
          ...extraFilters,
        },
      })
      setMovies(response.data.movies)
      setTotalCount(response.data.total)
    } catch (error) {
      console.error('Erro ao carregar filmes da API:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Adicionamos extraFilters como dependência para recarregar ao aplicar
  useEffect(() => {
    loadMovies()
  }, [page, debouncedSearch, extraFilters])

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
  }

  async function handleCreateMovie(formData: FormData) {
    // Envia via Multipart para aceitar o arquivo
    await api.post('/movies', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    loadMovies() // Recarrega a lista com o filme novo
  }

  return {
    movies,
    search,
    setSearch,
    page,
    setPage,
    isLoading,
    totalPages,
    handleSearchSubmit,
    isFiltersOpen,
    setIsFiltersOpen,
    handleApplyFilters: (filters: any) => {
      setExtraFilters(filters)
      setPage(1)
    },
    handleCreateMovie,
    isDrawerOpen,
    setIsDrawerOpen,
  }
}
