import { tokenStorage } from './token-storage'

type CleanupOptions = {
  clearTheme?: boolean
}

export const authCleanup = {
  clearAll: (options: CleanupOptions = {}): void => {
    const { clearTheme = false } = options

    tokenStorage.remove()

    if (clearTheme) {
      localStorage.removeItem('vite-ui-theme')
    }

    sessionStorage.clear()
  },

  hasSessionData: (): boolean => {
    return tokenStorage.exists()
  },
}
