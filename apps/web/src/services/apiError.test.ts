import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { getErrorMessage, NETWORK_ERROR, UNEXPECTED_ERROR } from './apiError'

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

describe('getErrorMessage', () => {
  it('maps a known status to its message', () => {
    expect(getErrorMessage(httpError(409), { 409: 'Já existe' })).toBe(
      'Já existe',
    )
  })

  it('falls back to a generic message for unmapped statuses', () => {
    expect(getErrorMessage(httpError(500), { 409: 'Já existe' })).toBe(
      UNEXPECTED_ERROR,
    )
  })

  it('reports a network error when there is no response', () => {
    expect(getErrorMessage(new AxiosError('Network Error'))).toBe(NETWORK_ERROR)
  })

  it('returns a generic message for non-axios errors', () => {
    expect(getErrorMessage(new Error('boom'))).toBe(UNEXPECTED_ERROR)
  })
})
