import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SocialLogin } from './SocialLogin'

const providers = [
  { name: 'Github', logo: '/github.png' },
  { name: 'Gmail', logo: '/gmail.png' },
]

describe('SocialLogin', () => {
  it('renders the divider and a button for each provider', () => {
    render(<SocialLogin providers={providers} onSelect={vi.fn()} />)
    expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Github' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gmail' })).toBeInTheDocument()
  })

  it('calls onSelect with the provider name', async () => {
    const onSelect = vi.fn()
    render(<SocialLogin providers={providers} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: 'Gmail' }))
    expect(onSelect).toHaveBeenCalledWith('Gmail')
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('renders no buttons for an empty provider list', () => {
    render(<SocialLogin providers={[]} onSelect={vi.fn()} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
