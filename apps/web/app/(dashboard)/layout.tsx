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
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        {children}
      </main>
    </div>
  )
}
