import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-red-500 dark:text-red-400">
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </span>
  )
}