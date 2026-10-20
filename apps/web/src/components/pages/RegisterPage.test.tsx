import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { RegisterPage } from './RegisterPage'

function setup() {
  render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>,
  )
}

describe('RegisterPage', () => {
  it('renders the heading, form and social providers', () => {
    setup()
    expect(screen.getByRole('heading', { name: 'Cadastro' })).toBeInTheDocument()
    expect(screen.getByText('Olá! Preencha seus dados.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Github' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gmail' })).toBeInTheDocument()
  })

  it('renders the register banner', () => {
    setup()
    expect(screen.getByAltText('Banner do Code Connect')).toHaveAttribute(
      'src',
      '/banner-register.png',
    )
  })

  it('links to the login page', () => {
    setup()
    expect(screen.getByRole('link', { name: 'Faça seu login!' })).toHaveAttribute(
      'href',
      '/login',
    )
  })
})
