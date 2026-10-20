const TOKEN_KEY = 'code-connect:access-token'

// "Lembrar-me" keeps the token across browser sessions; otherwise it lives
// only until the tab is closed.
export function saveToken(token: string, remember: boolean) {
  clearToken()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}
