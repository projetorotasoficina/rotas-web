const TOKEN_KEY = 'token'

export const tokenStorage = {
  get: (): string | null => {
    return sessionStorage.getItem(TOKEN_KEY)
  },

  set: (token: string): void => {
    sessionStorage.setItem(TOKEN_KEY, token)
  },

  remove: (): void => {
    sessionStorage.removeItem(TOKEN_KEY)
  },

  exists: (): boolean => {
    return sessionStorage.getItem(TOKEN_KEY) !== null
  },
}
