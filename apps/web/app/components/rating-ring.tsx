export function RatingRing({
  value,
  accent,
}: {
  value: number
  accent: string
}) {
  // 🌟 Aumentado o raio (r) para 30
  const r = 40
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c

  const getRingColor = () => {
    if (accent && accent !== '#8e4ec6') return accent
    if (value >= 70) return '#4ade80'
    if (value >= 50) return '#eab308'
    return '#ef4444'
  }

  const strokeColor = getRingColor()

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* 🌟 Caixa de fundo aumentada para h-18 w-18 para comportar o círculo maior */}
      <div className="relative grid h-24 w-24 place-items-center rounded-full bg-black/55 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {/* 🌟 viewBox expandido para 70 70 para dar espaço ao raio de 30 + espessura da borda */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 90 90">
          {/* 🌟 Centro (cx, cy) movido para 35 (metade do viewBox de 70) */}
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

        {/* Texto centralizado de forma automática */}
        <span className="text-sm font-bold text-white">
          {value}
          <span className="text-[0.6rem] text-white/70">%</span>
        </span>
      </div>
    </div>
  )
}
