import type { ReactNode } from 'react'

type AuthLayoutProps = {
  banner: { src: string; alt: string }
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({
  banner,
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-surface md:grid-cols-2">
        <img
          src={banner.src}
          alt={banner.alt}
          className="hidden h-full w-full object-cover md:block"
        />
        <main className="flex flex-col gap-8 p-8 md:p-12">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold text-offwhite">{title}</h1>
            <p className="text-gray-light">{subtitle}</p>
          </header>
          {children}
          {footer && <footer className="text-center text-sm text-gray-light">{footer}</footer>}
        </main>
      </div>
    </div>
  )
}
