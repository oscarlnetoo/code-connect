import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FormField } from './FormField'

describe('FormField', () => {
  it('associates the label with the input', () => {
    render(<FormField label="Senha" type="password" />)
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
  })

  it('shows no error by default', () => {
    render(<FormField label="Senha" />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeValid()
  })

  it('shows the error, marks the input invalid and links them', () => {
    render(<FormField label="Senha" error="Campo obrigatório" />)
    const input = screen.getByLabelText('Senha')
    expect(screen.getByRole('alert')).toHaveTextContent('Campo obrigatório')
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription('Campo obrigatório')
  })

  it('forwards input props such as onChange', async () => {
    const onChange = vi.fn()
    render(<FormField label="Email" onChange={onChange} />)
    await userEvent.type(screen.getByLabelText('Email'), 'a')
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
