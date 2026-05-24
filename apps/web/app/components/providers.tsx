'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { AuthProvider } from '../contexts/AuthContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      enableColorScheme={false}
      disableTransitionOnChange
      enableScript={false}
    >
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}
