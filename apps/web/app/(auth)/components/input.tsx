import { InputHTMLAttributes, forwardRef } from 'react'
import { ErrorMessage } from './error-message'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string 
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, error, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <input
          id={name}
          name={name}
          ref={ref}
          className={`h-11 w-full rounded-sm border bg-surface/80 px-3 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:ring-2 ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' 
              : 'border-border focus:border-brand focus:ring-brand/30'      
          }`}
          {...rest}
        />
        {error && <ErrorMessage message={error} />}
      </div>
    )
  }
)

Input.displayName = 'Input'