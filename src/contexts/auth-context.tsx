import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { toast } from 'sonner'
import { apiConfig, fetchWithAuth, setLogoutCallback } from '@/services/api'
import { authCleanup } from '@/services/auth-cleanup'
import { tokenStorage } from '@/services/token-storage'

export type User = {
  email: string
  nome: string
  telefone: string | null
  cpf: string | null
  authorities: string[]
}

type LogoutOptions = {
  showMessage?: boolean
  clearCache?: boolean
}

type AuthContextData = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: (options?: LogoutOptions) => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

type AuthProviderProps = {
  children: React.ReactNode
  queryClient?: { clear: () => void }
}

export function AuthProvider({ children, queryClient }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(
    (options: LogoutOptions = {}) => {
      const { showMessage = true, clearCache = true } = options

      if (clearCache && queryClient) {
        queryClient.clear()
      }

      authCleanup.clearAll()

      setToken(null)
      setUser(null)

      if (showMessage) {
        toast.success('Logout realizado com sucesso!')
      }
    },
    [queryClient]
  )

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
          authCleanup.clearAll()
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
