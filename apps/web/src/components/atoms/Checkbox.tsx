import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
}

export function Checkbox({ label, id, className = '', ...rest }: CheckboxProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <label
      htmlFor={inputId}
      className="flex cursor-pointer items-center gap-2 text-sm text-gray-light"
    >
      <input
        id={inputId}
        type="checkbox"
        className={`size-4 cursor-pointer accent-accent ${className}`}
        {...rest}
      />
      {label}
    </label>
  )
}
