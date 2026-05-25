import { ButtonHTMLAttributes, ReactNode } from 'react'

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function SubmitButton({ children, ...rest }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="rounded-sm  px-5 py-2.5 active:scale-95 text-sm font-semibold text-white bg-brandtransition hover:brightness-110 hover:bg-brand-hover"
      {...rest}
    >
      {children}
    </button>
  )
}
