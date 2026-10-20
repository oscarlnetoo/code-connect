import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('forwards props to the input element', () => {
    render(<Input placeholder="Senha" type="password" name="password" />)
    const input = screen.getByPlaceholderText('Senha')
    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveAttribute('name', 'password')
  })

  it('calls onChange when the user types', async () => {
    const onChange = vi.fn()
    render(<Input placeholder="Email" onChange={onChange} />)
    await userEvent.type(screen.getByPlaceholderText('Email'), 'ab')
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('exposes the invalid state via aria-invalid', () => {
    render(<Input placeholder="Email" aria-invalid />)
    expect(screen.getByPlaceholderText('Email')).toBeInvalid()
  })
})
