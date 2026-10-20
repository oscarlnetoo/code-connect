import { isAxiosError } from 'axios'

export const NETWORK_ERROR =
  'Não foi possível conectar ao servidor. Tente novamente.'
export const UNEXPECTED_ERROR = 'Algo deu errado. Tente novamente.'

export function getErrorMessage(
  error: unknown,
  byStatus: Partial<Record<number, string>> = {},
) {
  if (!isAxiosError(error)) return UNEXPECTED_ERROR
  if (!error.response) return NETWORK_ERROR
  return byStatus[error.response.status] ?? UNEXPECTED_ERROR
}
