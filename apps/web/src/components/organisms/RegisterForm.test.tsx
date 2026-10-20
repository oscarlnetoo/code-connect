import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RegisterForm } from './RegisterForm'

function setup(props: { error?: string; submitting?: boolean } = {}) {
  const onSubmit = vi.fn()
  render(<RegisterForm onSubmit={onSubmit} {...props} />)
  return { onSubmit }
}

describe('RegisterForm', () => {
  it('renders fields, remember checkbox and submit button', () => {
    setup()
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('Lembrar-me')).not.toBeChecked()
    expect(screen.getByRole('button', { name: /Cadastrar/ })).toBeInTheDocument()
  })

  it('shows required errors and does not submit when empty', async () => {
    const { onSubmit } = setup()
    await userEvent.click(screen.getByRole('button', { name: /Cadastrar/ }))
    expect(screen.getAllByRole('alert')).toHaveLength(3)
    expect(screen.getByLabelText('Nome')).toBeInvalid()
    expect(screen.getByLabelText('Email')).toBeInvalid()
    expect(screen.getByLabelText('Senha')).toBeInvalid()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('flags a malformed email', async () => {
    const { onSubmit } = setup()
    await userEvent.type(screen.getByLabelText('Nome'), 'Ana')
    await userEvent.type(screen.getByLabelText('Email'), 'ana@code')
    await userEvent.type(screen.getByLabelText('Senha'), 'segredo')
    await userEvent.click(screen.getByRole('button', { name: /Cadastrar/ }))
    expect(screen.getByText('Email inválido')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInvalid()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits trimmed values including remember when valid', async () => {
    const { onSubmit } = setup()
    await userEvent.type(screen.getByLabelText('Nome'), '  Ana Silva  ')
    await userEvent.type(screen.getByLabelText('Email'), '  ana@code.com  ')
    await userEvent.type(screen.getByLabelText('Senha'), 'segredo')
    await userEvent.click(screen.getByLabelText('Lembrar-me'))
    await userEvent.click(screen.getByRole('button', { name: /Cadastrar/ }))
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Ana Silva',
      email: 'ana@code.com',
      password: 'segredo',
      remember: true,
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows a form-level error', () => {
    setup({ error: 'Este email já está cadastrado' })
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Este email já está cadastrado',
    )
  })

  it('disables the submit button while submitting', () => {
    setup({ submitting: true })
    expect(screen.getByRole('button', { name: /Cadastrar/ })).toBeDisabled()
  })
})
