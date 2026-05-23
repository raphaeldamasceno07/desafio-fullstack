import { ReactNode } from 'react'

interface FormContainerProps {
  children: ReactNode
}

export function FormContainer({ children }: FormContainerProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-md mx-auto space-y-8 bg-surface p-6 rounded-lg border border-border shadow-lg md:p-8">
        {children}
      </div>
    </div>
  )
}
