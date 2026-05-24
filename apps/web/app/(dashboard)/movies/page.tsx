'use client'

import { CreateMovieDrawer } from '@/components/drawer'
import { FiltersModal } from '@/components/filters-modal'
import { MovieCard } from '@/components/movie-card'
import { Pagination } from './pagination'
import { SearchForm } from './search.form'
import { useMovies } from './use-movies'

export default function DashboardPage() {
  const {
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
    handleApplyFilters,
    handleCreateMovie,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useMovies()

  return (
    <main className="mx-auto w-full max-w-[1366px] flex-1 px-6 py-8 bg-transparent">
      <SearchForm
        search={search}
        onSearchChange={setSearch}
        onSubmit={handleSearchSubmit}
        onOpenFilters={() => setIsFiltersOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen}
      />

      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        movies={movies}
        onApplyFilters={handleApplyFilters}
      />

      <CreateMovieDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAddMovie={handleCreateMovie}
      />

      <section className="mt-6 rounded-md border border-border/60 bg-surface/80 p-6 shadow-2xl backdrop-blur-md min-h-[400px] flex flex-col justify-between">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 flex-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] w-full bg-muted/20 rounded-md animate-pulse border border-border/20"
              />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-muted-foreground">
            <p className="text-lg font-medium">Nenhum filme encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {page > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </section>
    </main>
  )
}
