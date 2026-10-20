import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from './LoginForm'

function setup(props: { error?: string; submitting?: boolean } = {}) {
  const onSubmit = vi.fn()
  render(
    <MemoryRouter>
      <LoginForm onSubmit={onSubmit} {...props} />
    </MemoryRouter>,
  )
  return { onSubmit }
}

describe('LoginForm', () => {
  it('renders fields, remember checkbox, forgot link and submit button', () => {
    setup()
    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('Lembrar-me')).not.toBeChecked()
    expect(screen.getByRole('link', { name: 'Esqueci a senha' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Login/ })).toBeInTheDocument()
  })

  it('shows required errors and does not submit when empty', async () => {
    const { onSubmit } = setup()
    await userEvent.click(screen.getByRole('button', { name: /Login/ }))
    expect(screen.getAllByRole('alert')).toHaveLength(2)
    expect(screen.getByLabelText('Email ou usuário')).toBeInvalid()
    expect(screen.getByLabelText('Senha')).toBeInvalid()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('only flags the missing field', async () => {
    const { onSubmit } = setup()
    await userEvent.type(screen.getByLabelText('Email ou usuário'), 'ana')
    await userEvent.click(screen.getByRole('button', { name: /Login/ }))
    expect(screen.getByLabelText('Email ou usuário')).toBeValid()
    expect(screen.getByLabelText('Senha')).toBeInvalid()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits the values including remember when filled', async () => {
    const { onSubmit } = setup()
    await userEvent.type(screen.getByLabelText('Email ou usuário'), 'ana@code.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'segredo')
    await userEvent.click(screen.getByLabelText('Lembrar-me'))
    await userEvent.click(screen.getByRole('button', { name: /Login/ }))
    expect(onSubmit).toHaveBeenCalledWith({
      identifier: 'ana@code.com',
      password: 'segredo',
      remember: true,
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows a form-level error', () => {
    setup({ error: 'Email ou senha inválidos' })
    expect(screen.getByRole('alert')).toHaveTextContent('Email ou senha inválidos')
  })

  it('disables the submit button while submitting', () => {
    setup({ submitting: true })
    expect(screen.getByRole('button', { name: /Login/ })).toBeDisabled()
  })
})
