import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from './api'
import { login, registerUser } from './auth'

describe('auth service', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('registers a user with POST /users', async () => {
    const user = {
      id: '1',
      name: 'Ana',
      email: 'ana@code.com',
      createdAt: '2026-01-01T00:00:00.000Z',
    }
    const post = vi.spyOn(api, 'post').mockResolvedValue({ data: user })
    const input = { name: 'Ana', email: 'ana@code.com', password: 'segredo123' }

    await expect(registerUser(input)).resolves.toEqual(user)
    expect(post).toHaveBeenCalledWith('/users', input)
  })

  it('logs in with POST /auth/tokens', async () => {
    const token = { accessToken: 'abc', tokenType: 'Bearer', expiresIn: 3600 }
    const post = vi.spyOn(api, 'post').mockResolvedValue({ data: token })
    const input = { email: 'ana@code.com', password: 'segredo123' }

    await expect(login(input)).resolves.toEqual(token)
    expect(post).toHaveBeenCalledWith('/auth/tokens', input)
  })

  it('propagates request failures', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new Error('boom'))
    await expect(
      login({ email: 'ana@code.com', password: 'x' }),
    ).rejects.toThrow('boom')
  })
})
