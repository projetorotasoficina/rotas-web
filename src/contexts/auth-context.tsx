import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { apiConfig, fetchWithAuth, setLogoutCallback } from '@/services/api'
import { tokenStorage } from '@/services/token-storage'

export type User = {
  email: string
  nome: string
  authorities: string[]
}

type AuthContextData = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(() => {
    tokenStorage.remove()
    setToken(null)
    setUser(null)
  }, [])

  const login = useCallback((newToken: string, newUser: User) => {
    tokenStorage.set(newToken)
    setToken(newToken)
    setUser(newUser)
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = tokenStorage.get()

      if (storedToken) {
        setToken(storedToken)
        try {
          const response = await fetchWithAuth(
            apiConfig.endpoints.usuarios.meuPerfil
          )
          const userData = (await response.json()) as User
          setUser(userData)
        } catch {
          tokenStorage.remove()
          setToken(null)
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  useEffect(() => {
    setLogoutCallback(logout)
  }, [logout])

  const isAuthenticated = Boolean(token && user)

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }

  return context
}
