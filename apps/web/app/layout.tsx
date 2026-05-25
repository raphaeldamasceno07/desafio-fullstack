import Image from 'next/image'
import cinemaBg from '../public/e1df294fbedd333816e64765ef61e876fa180ca3.png'
import { Footer } from './components/footer'
import { Header } from './components/header'
import { Providers } from './components/providers'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased text-foreground relative overflow-x-hidden">
        <Providers>
          {/* Imagem de Fundo (Fixo atrás de tudo) */}
          <Image
            src={cinemaBg}
            alt="Plateia de cinema escura"
            placeholder="blur"
            quality={100}
            fill
            sizes="100vw"
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            className="z-0 fixed inset-0 pointer-events-none"
          />

          {/* Overlay de Escurecimento */}
          <div className="fixed inset-0 bg-black/75 z-10 pointer-events-none" />

          {/* 🌟 Estrutura de Fluxo Principal: Tudo dentro de um container flex */}
          <div className="relative z-20 min-h-screen w-full flex flex-col">
            <Header />

            {/* 🌟 Tag <main> semântica com flex-1 para empurrar o footer para a base */}
            <main className="flex-1 pt-20 w-full flex flex-col">
              {children}
            </main>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
