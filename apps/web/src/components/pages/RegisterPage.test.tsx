import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, AxiosHeaders } from 'axios'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login, registerUser } from '../../services/auth'
import { saveToken } from '../../services/tokenStorage'
import { RegisterPage } from './RegisterPage'

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
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText('Nome'), 'Ana Silva')
  await userEvent.type(screen.getByLabelText('Email'), 'ana@code.com')
  await userEvent.type(screen.getByLabelText('Senha'), 'segredo123')
  await userEvent.click(screen.getByRole('button', { name: /Cadastrar/ }))
}

describe('RegisterPage', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('renders the heading, form and social providers', () => {
    setup()
    expect(screen.getByRole('heading', { name: 'Cadastro' })).toBeInTheDocument()
    expect(screen.getByText('Olá! Preencha seus dados.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Github' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gmail' })).toBeInTheDocument()
  })

  it('renders the register banner', () => {
    setup()
    expect(screen.getByAltText('Banner do Code Connect')).toHaveAttribute(
      'src',
      '/banner-register.png',
    )
  })

  it('links to the login page', () => {
    setup()
    expect(screen.getByRole('link', { name: 'Faça seu login!' })).toHaveAttribute(
      'href',
      '/login',
    )
  })

  it('registers, logs the user in and leaves the register page', async () => {
    vi.mocked(registerUser).mockResolvedValue({
      id: '1',
      name: 'Ana Silva',
      email: 'ana@code.com',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    vi.mocked(login).mockResolvedValue({
      accessToken: 'abc',
      tokenType: 'Bearer',
      expiresIn: 3600,
    })
    setup()
    await fillAndSubmit()
    expect(registerUser).toHaveBeenCalledWith({
      name: 'Ana Silva',
      email: 'ana@code.com',
      password: 'segredo123',
    })
    expect(login).toHaveBeenCalledWith({
      email: 'ana@code.com',
      password: 'segredo123',
    })
    expect(saveToken).toHaveBeenCalledWith('abc', false)
    expect(await screen.findByText('Home')).toBeInTheDocument()
  })

  it('shows an error when the email is already registered', async () => {
    vi.mocked(registerUser).mockRejectedValue(httpError(409))
    setup()
    await fillAndSubmit()
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Este email já está cadastrado',
    )
    expect(login).not.toHaveBeenCalled()
    expect(saveToken).not.toHaveBeenCalled()
  })

  it('disables the submit button while the request is pending', async () => {
    vi.mocked(registerUser).mockReturnValue(new Promise(() => {}))
    setup()
    await fillAndSubmit()
    expect(screen.getByRole('button', { name: /Cadastrar/ })).toBeDisabled()
  })
})
