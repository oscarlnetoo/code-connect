import { api } from './api'

export type RegisterInput = {
  name: string
  email: string
  password: string
}

export type LoginInput = {
  email: string
  password: string
}

export type User = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type TokenResponse = {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: number
}

export async function registerUser(input: RegisterInput) {
  const { data } = await api.post<User>('/users', input)
  return data
}

export async function login(input: LoginInput) {
  const { data } = await api.post<TokenResponse>('/auth/tokens', input)
  return data
}
