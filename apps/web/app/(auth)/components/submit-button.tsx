import { ComponentProps } from 'react'

interface SubmitButtonProps extends ComponentProps<'button'> {
  isLoading: boolean
  loadingLabel?: string
  label: string
}

export function SubmitButton({
  isLoading,
  label,
  loadingLabel = 'Carregando...',
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="btn-primary"
      {...props}
    >
      {isLoading ? loadingLabel : label}
    </button>
  )
}
