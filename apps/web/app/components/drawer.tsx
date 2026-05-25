'use client'

import { Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'

interface CreateMovieDrawerProps {
  isOpen: boolean
  onClose: () => void
  onAddMovie: (formData: FormData) => Promise<void>
}

export function CreateMovieDrawer({
  isOpen,
  onClose,
  onAddMovie,
}: CreateMovieDrawerProps) {
  const [title, setTitle] = useState('')
  const [originalTitle, setOriginalTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [duration, setDuration] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [budget, setBudget] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 🌟 NOVOS ESTADOS DOS CAMPOS DO FIGMA:
  const [popularity, setPopularity] = useState('0')
  const [voteCount, setVoteCount] = useState('0')
  const [rating, setRating] = useState('0')
  const [status, setStatus] = useState('Lançado')
  const [language, setLanguage] = useState('Inglês')
  const [revenue, setRevenue] = useState('0')

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  if (!isOpen) return null

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !description || !duration || !releaseDate || !budget) return

    setIsSubmitting(true)

    try {
      const formData = new FormData()

      // Campos base anteriores
      formData.append('title', title.trim())
      formData.append('original_title', originalTitle.trim() || title.trim())
      formData.append('description', description.trim())
      formData.append('release_date', releaseDate)
      formData.append('duration', duration)
      formData.append('budget', budget)

      if (genre) formData.append('genre', genre.trim())
      if (selectedFile) formData.append('file', selectedFile)

      // 🌟 ANEXANDO OS NOVOS CAMPOS EXATAMENTE IGUAIS AO SCHEMA DO BACKEND:
      formData.append('popularity', popularity || '0')
      formData.append('vote_count', voteCount || '0')
      formData.append('rating', rating || '0')
      formData.append('status', status.trim())
      formData.append('language', language.trim())
      formData.append('revenue', revenue || '0')

      await onAddMovie(formData)

      // Limpeza completa dos estados pós-sucesso
      setTitle('')
      setOriginalTitle('')
      setDescription('')
      setGenre('')
      setDuration('')
      setReleaseDate('')
      setBudget('')
      setSelectedFile(null)

      // Limpeza dos novos campos
      setPopularity('0')
      setVoteCount('0')
      setRating('0')
      setStatus('Lançado')
      setLanguage('Inglês')
      setRevenue('0')

      onClose()
    } catch (error) {
      console.error('Erro ao adicionar filme no submit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* 🌟 pt-6 para alinhar o título perfeitamente no topo */}
      <div className="h-full w-full max-w-md border-l border-border/70 bg-card/95 p-6 pt-6 shadow-2xl backdrop-blur flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Bloco de Conteúdo com Scroll */}
        <div className="flex flex-col flex-1 overflow-y-auto pr-1 select-scrollbar">
          {/* Cabeçalho */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Adicionar Filme
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-sm text-muted-foreground hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Formulário */}
          <form
            id="create-movie-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            {/* Título */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                Título
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Homem de Ferro"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="input-text w-full px-4 h-11 text-sm outline-none text-foreground"
              />
            </div>

            {/* Título Original */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                Título em Inglês (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Iron Man"
                value={originalTitle}
                onChange={e => setOriginalTitle(e.target.value)}
                className="input-text w-full px-4 h-11 text-sm outline-none text-foreground"
              />
            </div>

            {/* Sinopse / Descrição */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                Sinopse / Descrição
              </label>
              <textarea
                required
                placeholder="Digite a sinopse do filme..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="input-text w-full px-4 py-2 min-h-[80px] text-sm outline-none text-foreground resize-none"
              />
            </div>

            {/* Grid de 2 Colunas para campos menores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                  Gênero
                </label>
                <input
                  type="text"
                  placeholder="Ex: Ação"
                  value={genre}
                  onChange={e => setGenre(e.target.value)}
                  className="input-text w-full px-4 h-11 text-sm outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                  Duração (min)
                </label>
                <input
                  type="number"
                  required
                  placeholder="Ex: 126"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="input-text w-full px-4 h-11 text-sm outline-none text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                  Orçamento ($)
                </label>
                <input
                  type="number"
                  required
                  placeholder="Ex: 140000000"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  className="input-text w-full px-4 h-11 text-sm outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                  Faturamento ($)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 585000000"
                  value={revenue}
                  onChange={e => setRevenue(e.target.value)}
                  className="input-text w-full px-4 h-11 text-sm outline-none text-foreground"
                />
              </div>
            </div>

            {/* 🌟 SEGUNDO BLOCO DE GRID: NOVOS CAMPOS DO FIGMA */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                  Nota (Rating)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="Ex: 8.5"
                  value={rating}
                  onChange={e => setRating(e.target.value)}
                  className="input-text w-full px-4 h-11 text-sm outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                  Votos (Count)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 1500"
                  value={voteCount}
                  onChange={e => setVoteCount(e.target.value)}
                  className="input-text w-full px-4 h-11 text-sm outline-none text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                  Popularidade
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 94.2"
                  value={popularity}
                  onChange={e => setPopularity(e.target.value)}
                  className="input-text w-full px-4 h-11 text-sm outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                  Idioma Original
                </label>
                <input
                  type="text"
                  placeholder="Ex: Inglês"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="input-text w-full px-4 h-11 text-sm outline-none text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                  Lançamento
                </label>
                <input
                  type="date"
                  required
                  value={releaseDate}
                  onChange={e => setReleaseDate(e.target.value)}
                  className="input-text w-full px-3 h-11 text-sm outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="input-text w-full px-3 h-11 text-sm outline-none bg-card text-foreground cursor-pointer"
                >
                  <option value="Lançado">Lançado</option>
                  <option value="Rumores">Rumores</option>
                  <option value="Em Produção">Em Produção</option>
                  <option value="Pós-Produção">Pós-Produção</option>
                </select>
              </div>
            </div>

            {/* Pôster */}
            <div className="flex flex-col gap-1.5 pb-4">
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                Pôster do Filme
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 w-full h-24 border border-dashed border-border/80 rounded-sm bg-input/10 hover:bg-input/20 hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium w-full truncate px-4 text-center">
                  {selectedFile
                    ? selectedFile.name
                    : 'Selecionar imagem de capa'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Rodapé Fixo */}
        <div className="mt-4 flex justify-end gap-2 border-t border-border/40 pt-4 bg-transparent shrink-0">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="btn-secondary px-4 h-11 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="create-movie-form"
            disabled={isSubmitting}
            className="btn-primary px-4 h-11 disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  )
}
