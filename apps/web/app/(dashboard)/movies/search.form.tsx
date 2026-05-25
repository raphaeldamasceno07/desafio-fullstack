'use client'

import { Search } from 'lucide-react'

interface SearchFormProps {
  search: string
  onSearchChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onOpenFilters: () => void
  onOpenDrawer: () => void
}

export function SearchForm({
  search,
  onSearchChange,
  onSubmit,
  onOpenFilters,
  onOpenDrawer,
}: SearchFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-wrap items-center gap-3 justify-end"
    >
      <div className="relative min-w-[280px]">
        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--mauve-12)" />
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Pesquise por filmes"
          className="input-text px-6"
        />
      </div>

      {/* 🌟 Ativando o clique do botão Filtros */}
      <button
        type="button"
        onClick={onOpenFilters}
        className="btn-secondary px-4"
      >
        Filtros
      </button>

      <button
        type="button"
        onClick={() => onOpenDrawer()}
        className="btn-primary px-4"
      >
        Adicionar Filme
      </button>
    </form>
  )
}
