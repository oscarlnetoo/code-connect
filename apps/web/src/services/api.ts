import axios from 'axios'
import { getToken } from './tokenStorage'

// Defaults to the Vite dev proxy (see vite.config.ts), so no CORS is needed.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/v1',
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
