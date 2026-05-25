'use client'

import { MovieResponse } from '@movie-challenge/core-types'
import Image from 'next/image'
import { RatingRing } from './rating-ring'

interface MovieCardProps {
  movie: MovieResponse
}

export function MovieCard({ movie }: MovieCardProps) {
  // 🌟 Usamos poster_url vindo direto da API do backend
  const hasPoster =
    typeof movie.poster_url === 'string' && movie.poster_url.trim() !== ''

  return (
    <article className="group relative aspect-[2/3] overflow-hidden rounded-md border border-border/60 bg-surface/80 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-brand/60 cursor-pointer">
      {hasPoster ? (
        <Image
          src={movie.poster_url!} // 👈 Mudado de posterUrl para poster_url!
          alt={`Pôster do filme ${movie.title}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          priority={false}
          className="object-cover transition-transform duration-500 group-hover:scale-105 z-0"
        />
      ) : (
        /* FALLBACK: Se não tiver pôster, exibe o gradiente clássico */
        <div className="absolute inset-0 bg-gradient-to-br from-purple-9 to-mauve-3 opacity-20 pointer-events-none mix-blend-plus-lighter" />
      )}

      {/* Camada sutil de contraste para o texto flutuar melhor */}
      <div className="absolute inset-0 bg-black/20 opacity-100 transition-opacity duration-300 group-hover:bg-black/45 z-10" />

      {/* Overlay Texturizado de Reflexo */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.2), transparent 40%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.4), transparent 50%)',
        }}
      />

      {/* Bottom info on hover */}
      <div className="absolute inset-x-0 bottom-0 translate-y-1/3 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
        <p className="text-xs uppercase tracking-widest text-white/70">
          {movie.genre}
        </p>
        <p className="text-sm font-semibold text-white">{movie.title}</p>
      </div>

      {/* Rating ring */}
      <RatingRing value={movie.rating || 0} />

      {/* Linha interna de contorno de vidro */}
      <div className="absolute inset-0 rounded-md ring-1 ring-inset ring-white/10 pointer-events-none z-20" />
    </article>
  )
}
