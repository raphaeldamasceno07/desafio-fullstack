'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Film, LogOut } from 'lucide-react'
import { ThemeToggle } from '../components/theme.toggle'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full bg-surface border-b border-border h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Film className="w-6 h-6 text-brand" />
          <span className="font-bold text-lg tracking-wide text-foreground hidden sm:inline">
            CineBase
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex flex-col text-right hidden xs:flex">
              <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                {user.name}
              </span>
              <span className="text-xs text-muted max-w-[120px] truncate">
                {user.email}
              </span>
            </div>
          )}

          <div className="w-px h-6 bg-border hidden xs:block" />

          <ThemeToggle />

          <button
            onClick={logout}
            className="p-2 rounded-md hover:bg-brand-low text-muted hover:text-brand transition-colors"
            title="Sair do sistema"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        {children}
      </main>
    </div>
  )
}
