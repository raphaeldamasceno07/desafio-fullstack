'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-surface border border-transparent hover:border-border text-muted hover:text-foreground transition-all active:scale-95"
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-brand" />
      ) : (
        <Moon className="w-5 h-5 text-brand" />
      )}
    </button>
  )
}
