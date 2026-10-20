import type { InputHTMLAttributes } from 'react'

export function Input({
  className = '',
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-gray bg-surface px-4 py-3 text-offwhite placeholder:text-gray focus-visible:outline-2 focus-visible:outline-accent aria-invalid:border-red-400 ${className}`}
      {...rest}
    />
  )
}
