import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SocialLoginButton } from './SocialLoginButton'

describe('SocialLoginButton', () => {
  it('renders the provider logo with its alt text inside a button', () => {
    render(<SocialLoginButton src="/github.png" alt="Github" />)
    const button = screen.getByRole('button', { name: 'Github' })
    expect(button).toHaveAttribute('type', 'button')
    expect(screen.getByAltText('Github')).toHaveAttribute('src', '/github.png')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<SocialLoginButton src="/gmail.png" alt="Gmail" onClick={onClick} />)
    await userEvent.click(screen.getByRole('button', { name: 'Gmail' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
