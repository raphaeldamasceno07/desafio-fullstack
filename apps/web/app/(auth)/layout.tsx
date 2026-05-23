import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 w-full flex items-center justify-center p-4 md:p-10">
      {children}
    </main>
  )
}
