'use client'

import { ThemeProvider } from 'next-themes' // 🌟 Importação normal, sem dynamic!
import { ReactNode, useEffect, useState } from 'react'
import { AuthProvider } from '../contexts/AuthContext'

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      enableColorScheme={false}
      disableTransitionOnChange
    >
      <AuthProvider>
        <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
          {children}
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}
