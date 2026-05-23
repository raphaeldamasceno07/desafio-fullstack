'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './theme.toggle'

export function Header() {
  const { user, logout, isLoading, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log(isAuthenticated)
  }, [isAuthenticated])

  // ⛔ Evita flicker e estado incorreto
  if (!mounted || isLoading) {
    return (
      <header className="fixed top-0 left-0 w-full h-20 bg-black/40 backdrop-blur-sm border-b border-border z-50 px-4 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-28 bg-surface/50 animate-pulse rounded-sm" />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="w-24 h-10 bg-surface/50 animate-pulse rounded-sm" />
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-black/40 backdrop-blur-sm border-b border-border z-50 px-4 md:px-10 flex items-center justify-between">
      {/* LOGO */}
      <div className="flex items-center gap-3">
        <Image
          src="/logo-cubos.svg"
          alt="CUBOS movies Logo"
          width={120}
          height={32}
          className="h-8 w-auto"
          priority
        />
      </div>

      {/* AÇÕES */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {isAuthenticated ? (
          <button
            onClick={logout}
            className="btn-primary px-6 h-10 transition-all active:scale-95 flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        ) : (
          <Link
            href={pathname === '/login' ? '/register' : '/login'}
            className="btn-primary px-6 h-10 transition-all active:scale-95 flex items-center justify-center"
          >
            {pathname === '/login' ? 'Cadastrar' : 'Login'}
          </Link>
        )}
      </div>
    </header>
  )
}
