import type { AxiosAdapter } from 'axios'
import { afterEach, describe, expect, it } from 'vitest'
import { api } from './api'
import { clearToken, saveToken } from './tokenStorage'

// Echoes the outgoing request back so the test can inspect it.
const echo: AxiosAdapter = async (config) => ({
  data: config,
  status: 200,
  statusText: 'OK',
  headers: {},
  config,
})

describe('api', () => {
  afterEach(clearToken)

  it('targets the versioned api through the dev proxy by default', () => {
    expect(api.defaults.baseURL).toBe('/v1')
  })

  it('sends no Authorization header without a token', async () => {
    const { data } = await api.get('/users/me', { adapter: echo })
    expect(data.headers.Authorization).toBeUndefined()
  })

  it('sends the stored token as a Bearer Authorization header', async () => {
    saveToken('abc', false)
    const { data } = await api.get('/users/me', { adapter: echo })
    expect(data.headers.Authorization).toBe('Bearer abc')
  })
})
