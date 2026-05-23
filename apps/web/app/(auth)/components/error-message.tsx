interface ErrorMessageProps {
  message: string | null
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null

  return (
    <div className="bg-brand-low border border-brand/30 text-brand text-sm px-4 py-3 rounded-md font-medium text-center animate-fade-in">
      {message}
    </div>
  )
}
