import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders the centered text', () => {
    render(<Divider>ou entre com outras contas</Divider>)
    expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument()
  })

  it('has the separator role', () => {
    render(<Divider>ou</Divider>)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })
})
