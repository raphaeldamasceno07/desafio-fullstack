export function RatingRing({ value }: { value: number }) {
  // Raio (r) estendido para 40 conforme seu layout atualizado
  const r = 40
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c

  // 🌟 MUDANÇA: A cor agora é definida estritamente pelo valor da nota
  const getRingColor = () => {
    if (value >= 70) return '#4ade80' // Verde para alta popularidade
    if (value >= 50) return '#eab308' // Amarelo para média
    return '#ef4444' // Vermelho para baixa
  }

  const strokeColor = getRingColor()

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
      <div className="relative grid h-24 w-24 place-items-center rounded-full bg-black/55 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 90 90">
          <circle
            cx="45"
            cy="45"
            r={r}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="3.5"
            fill="none"
          />
          <circle
            cx="45"
            cy="45"
            r={r}
            stroke={strokeColor}
            strokeWidth="3.5"
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>

        <span className="text-sm font-bold text-white">
          {value}
          <span className="text-[0.6rem] text-white/70">%</span>
        </span>
      </div>
    </div>
  )
}
