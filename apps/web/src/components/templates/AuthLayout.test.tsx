import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthLayout } from './AuthLayout'

const banner = { src: '/banner.png', alt: 'Banner de teste' }

describe('AuthLayout', () => {
  it('renders banner, title, subtitle, children and footer', () => {
    render(
      <AuthLayout
        banner={banner}
        title="Login"
        subtitle="Boas-vindas!"
        footer={<span>Rodapé</span>}
      >
        <p>Formulário</p>
      </AuthLayout>,
    )
    expect(screen.getByAltText('Banner de teste')).toHaveAttribute('src', '/banner.png')
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByText('Boas-vindas!')).toBeInTheDocument()
    expect(screen.getByText('Formulário')).toBeInTheDocument()
    expect(screen.getByText('Rodapé')).toBeInTheDocument()
  })

  it('omits the footer when none is given', () => {
    render(
      <AuthLayout banner={banner} title="Cadastro" subtitle="Crie sua conta">
        <p>Form</p>
      </AuthLayout>,
    )
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

  it('applies a custom banner className', () => {
    render(
      <AuthLayout
        banner={{ ...banner, className: 'object-[60%_50%]' }}
        title="Cadastro"
        subtitle="Crie sua conta"
      >
        <p>Form</p>
      </AuthLayout>,
    )
    expect(screen.getByAltText('Banner de teste')).toHaveClass('object-cover', 'object-[60%_50%]')
  })
})
