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
    return <div className="w-10 h-10" />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="grid h-9 w-9 place-items-center rounded-sm border border-border bg-(--brand-low) text-foreground/80 transition hover:bg-secondary">
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" fill="white" />
      ) : (
        <Moon className="w-5 h-5 text-brand" />
      )}
    </button> 
  )
}
