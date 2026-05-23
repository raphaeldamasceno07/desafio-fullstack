import { Film } from 'lucide-react'

interface LoginHeaderProps {
  subtitle: string
}

export function LoginHeader({ subtitle }: LoginHeaderProps) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-2">
        <Film className="w-10 h-10 text-brand" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-foreground">
        CineBase
      </h2>
      <p className="mt-2 text-sm text-muted">{subtitle}</p>
    </div>
  )
}
