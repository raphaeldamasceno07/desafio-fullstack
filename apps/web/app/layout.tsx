import type { Metadata } from 'next'
import { Providers } from '../components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Desafio Cubos - Fullstack',
  description: 'Gerenciador de filmes.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
