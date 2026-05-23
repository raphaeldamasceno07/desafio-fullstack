import { ComponentProps, ReactNode } from 'react'

interface SubmitButtonProps extends ComponentProps<'button'> {
  isLoading?: boolean
  children: ReactNode
}

export function SubmitButton({
  isLoading,
  children,
  ...props
}: SubmitButtonProps) {
  return (
    <button 
      type="submit"
      disabled={isLoading || props.disabled}
      className="flex h-10 items-center justify-center rounded-sm bg-brand px-6 text-sm font-semibold text-white transition-all hover:bg-brand-hover active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </button>
  )
}