'use client'

import { ReactNode, FormEvent } from 'react'

interface FormContainerProps {
  children: ReactNode
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export function FormContainer({ children, onSubmit }: FormContainerProps) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-md border border-border/60 bg-surface/80 p-6 shadow-2xl backdrop-blur-md space-y-4"
      >
        {children}
      </form>
    </main>
  )
}