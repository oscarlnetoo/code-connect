import type { ButtonHTMLAttributes } from 'react'

type SocialLoginButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> & {
  src: string
  alt: string
}

export function SocialLoginButton({
  src,
  alt,
  className = '',
  ...rest
}: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      className={`flex cursor-pointer items-center justify-center rounded-lg bg-surface px-6 py-3 transition hover:brightness-125 focus-visible:outline-2 focus-visible:outline-accent ${className}`}
      {...rest}
    >
      <img src={src} alt={alt} className="h-6" />
    </button>
  )
}
