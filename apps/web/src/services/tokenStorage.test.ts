import { afterEach, describe, expect, it } from 'vitest'
import { clearToken, getToken, saveToken } from './tokenStorage'

describe('tokenStorage', () => {
  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('returns null when no token is stored', () => {
    expect(getToken()).toBeNull()
  })

  it('persists in localStorage when remember is on', () => {
    saveToken('abc', true)
    expect(localStorage.length).toBe(1)
    expect(sessionStorage.length).toBe(0)
    expect(getToken()).toBe('abc')
  })

  it('keeps the token in sessionStorage when remember is off', () => {
    saveToken('abc', false)
    expect(localStorage.length).toBe(0)
    expect(sessionStorage.length).toBe(1)
    expect(getToken()).toBe('abc')
  })

  it('replaces a token saved with a different remember choice', () => {
    saveToken('old', true)
    saveToken('new', false)
    expect(localStorage.length).toBe(0)
    expect(getToken()).toBe('new')
  })

  it('clears the token from both storages', () => {
    saveToken('abc', true)
    clearToken()
    expect(getToken()).toBeNull()
  })
})
