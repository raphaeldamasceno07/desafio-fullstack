'use client'

import { MovieResponse } from '@movie-challenge/core-types'
import { X } from 'lucide-react'
import { useState } from 'react'
import { Backdrop } from './back-drop'

interface FiltersModalProps {
  isOpen: boolean
  onClose: () => void
  movies: MovieResponse[] // 🌟 Recebe os filmes reais do banco
  onApplyFilters?: (filters: any) => void
}

export function FiltersModal({
  isOpen,
  onClose,
  movies,
  onApplyFilters,
}: FiltersModalProps) {
  const [genre, setGenre] = useState('')
  const [duration, setDuration] = useState('')
  const [releaseStart, setReleaseStart] = useState('')
  const [releaseEnd, setReleaseEnd] = useState('')

  if (!isOpen) return null

  const availableGenres = Array.from(
    new Set(movies.map(movie => movie.genre).filter(Boolean)),
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const activeFilters = {
      genre: genre || undefined,
      duration: duration ? Number(duration) : undefined,
      releaseStart: releaseStart || undefined,
      releaseEnd: releaseEnd || undefined,
    }

    if (onApplyFilters) {
      onApplyFilters(activeFilters)
    }

    setGenre('')
    setDuration('')
    setReleaseStart('')
    setReleaseEnd('')

    onClose()
  }

  return (
    <Backdrop onClose={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-md border border-border/70 bg-card/95 p-6 shadow-2xl backdrop-blur animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Cabeçalho */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Gênero Dinâmico */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
              Gênero
            </label>
            <select
              value={genre}
              onChange={e => setGenre(e.target.value)}
              className="input-text w-full px-4 bg-input/40 border border-border rounded-sm h-11 text-sm outline-none focus:border-primary text-foreground"
            >
              <option value="" className="bg-card text-muted-foreground">
                Todos
              </option>

              {/* 🌟 Mapeia apenas os gêneros que vieram do banco */}
              {availableGenres.map(availableGenre => (
                <option
                  key={availableGenre}
                  value={availableGenre}
                  className="bg-card"
                >
                  {availableGenre}
                </option>
              ))}
            </select>
          </div>

          {/* Duração */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
              Duração Máxima (minutos)
            </label>
            <input
              type="number"
              placeholder="Ex: 120"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="input-text w-full px-4 h-11 text-sm outline-none text-foreground"
            />
          </div>

          {/* Lançamento */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
              Lançamento (Período)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase">
                  Início
                </span>
                <input
                  type="date"
                  value={releaseStart}
                  onChange={e => setReleaseStart(e.target.value)}
                  className="input-text w-full px-3 h-11 text-sm outline-none text-foreground"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase">
                  Fim
                </span>
                <input
                  type="date"
                  value={releaseEnd}
                  onChange={e => setReleaseEnd(e.target.value)}
                  className="input-text w-full px-3 h-11 text-sm outline-none text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-4"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary px-4">
              Aplicar filtro
            </button>
          </div>
        </form>
      </div>
    </Backdrop>
  )
}
