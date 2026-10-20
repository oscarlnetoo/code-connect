import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, AxiosHeaders } from 'axios'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login } from '../../services/auth'
import { saveToken } from '../../services/tokenStorage'
import { LoginPage } from './LoginPage'

vi.mock('../../services/auth')
vi.mock('../../services/tokenStorage')

function httpError(status: number) {
  const config = { headers: new AxiosHeaders() }
  return new AxiosError('failed', undefined, config, null, {
    status,
    statusText: '',
    headers: {},
    config,
    data: {},
  })
}

function setup() {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText('Email ou usuário'), 'ana@code.com')
  await userEvent.type(screen.getByLabelText('Senha'), 'segredo123')
  await userEvent.click(screen.getByLabelText('Lembrar-me'))
  await userEvent.click(screen.getByRole('button', { name: /Login/ }))
}

describe('LoginPage', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('renders the heading, form and social providers', () => {
    setup()
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByText('Boas-vindas! Faça seu login.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Github' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gmail' })).toBeInTheDocument()
  })

  it('renders the login banner', () => {
    setup()
    expect(screen.getByAltText('Banner do Code Connect')).toHaveAttribute(
      'src',
      '/banner-login.png',
    )
  })

  it('links to the register page', () => {
    setup()
    expect(
      screen.getByRole('link', { name: 'Crie seu cadastro!' }),
    ).toHaveAttribute('href', '/register')
  })

  it('logs in, stores the token and leaves the login page', async () => {
    vi.mocked(login).mockResolvedValue({
      accessToken: 'abc',
      tokenType: 'Bearer',
      expiresIn: 3600,
    })
    setup()
    await fillAndSubmit()
    expect(login).toHaveBeenCalledWith({
      email: 'ana@code.com',
      password: 'segredo123',
    })
    expect(saveToken).toHaveBeenCalledWith('abc', true)
    expect(await screen.findByText('Home')).toBeInTheDocument()
  })

  it('shows an error for invalid credentials', async () => {
    vi.mocked(login).mockRejectedValue(httpError(401))
    setup()
    await fillAndSubmit()
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Email ou senha inválidos',
    )
    expect(saveToken).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /Login/ })).toBeEnabled()
  })

  it('disables the submit button while the request is pending', async () => {
    vi.mocked(login).mockReturnValue(new Promise(() => {}))
    setup()
    await fillAndSubmit()
    expect(screen.getByRole('button', { name: /Login/ })).toBeDisabled()
  })
})
