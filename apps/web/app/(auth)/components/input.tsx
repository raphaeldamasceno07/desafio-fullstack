import { ComponentProps, forwardRef } from 'react'

interface InputProps extends ComponentProps<'input'> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
        <input ref={ref} className="input-text" {...props} />
        {error && (
          <p className="mt-1 text-xs text-brand font-medium animate-fade-in">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
