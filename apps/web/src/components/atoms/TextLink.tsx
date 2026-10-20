import { Link } from 'react-router'
import type { ComponentProps } from 'react'

export function TextLink({
  className = '',
  ...rest
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-accent ${className}`}
      {...rest}
    />
  )
}
