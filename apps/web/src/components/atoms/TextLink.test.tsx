import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { TextLink } from './TextLink'

describe('TextLink', () => {
  it('renders a link pointing to the given route', () => {
    render(
      <MemoryRouter>
        <TextLink to="/register">Crie seu cadastro!</TextLink>
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('link', { name: 'Crie seu cadastro!' }),
    ).toHaveAttribute('href', '/register')
  })

  it('forwards extra props', () => {
    render(
      <MemoryRouter>
        <TextLink to="/x" aria-label="custom">
          x
        </TextLink>
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'custom' })).toBeInTheDocument()
  })
})
