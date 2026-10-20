import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('associates the label with the checkbox', () => {
    render(<Checkbox label="Lembrar-me" />)
    expect(screen.getByLabelText('Lembrar-me')).toHaveAttribute('type', 'checkbox')
  })

  it('toggles and calls onChange on click', async () => {
    const onChange = vi.fn()
    render(<Checkbox label="Lembrar-me" onChange={onChange} />)
    const checkbox = screen.getByLabelText('Lembrar-me')
    expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('clicking the label toggles the checkbox', async () => {
    render(<Checkbox label="Lembrar-me" />)
    await userEvent.click(screen.getByText('Lembrar-me'))
    expect(screen.getByLabelText('Lembrar-me')).toBeChecked()
  })
})
