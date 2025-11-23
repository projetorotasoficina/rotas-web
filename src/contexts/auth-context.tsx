/**
 * @file Contexto de Autenticação.
 * @description Este arquivo gerencia o estado de autenticação do usuário em toda a aplicação.
 * Ele utiliza o Context API do React para prover informações do usuário, o token de autenticação
 * e o status de autenticação (logado ou não).
 *
 * O `AuthProvider` é o componente provedor que encapsula a lógica de:
 * - Inicializar o estado de autenticação a partir do `tokenStorage`.
 * - Buscar os dados do usuário na API se um token existir.
 * - Fornecer as funções `login` e `logout` para alterar o estado de autenticação.
 * - Registrar a função de `logout` no módulo `api` para deslogar o usuário automaticamente
 *   em caso de erro de autorização (401/403).
 *
 * O hook `useAuth` é um atalho para consumir este contexto nos componentes.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { apiConfig, fetchWithAuth, setLogoutCallback } from '@/services/api'
import { tokenStorage } from '@/services/token-storage'

/**
 * @description Define a estrutura de dados para o objeto de usuário.
 */
export type User = {
  email: string;
  nome: string;
  telefone: string | null;
  cpf: string | null;
  authorities: string[];
};

/**
 * @description Define a estrutura de dados para o contexto de autenticação.
 */
type AuthContextData = {
  /**
   * O objeto do usuário autenticado, ou `null` se não houver usuário logado.
   */
  user: User | null
  /**
   * O token de autenticação (JWT), ou `null` se não estiver autenticado.
   */
  token: string | null
  /**
   * `true` se o usuário estiver autenticado (possui token e dados de usuário), `false` caso contrário.
   */
  isAuthenticated: boolean
  /**
   * `true` enquanto o estado inicial de autenticação está sendo verificado, `false` depois.
   */
  isLoading: boolean
  /**
   * Função para realizar o login, armazenando o token e os dados do usuário.
   * @param token O token JWT recebido da API.
   * @param user O objeto de usuário recebido da API.
   */
  login: (token: string, user: User) => void
  /**
   * Função para realizar o logout, limpando o token e os dados do usuário do estado e do `tokenStorage`.
   */
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

type AuthProviderProps = {
  children: React.ReactNode
}

/**
 * @description Provedor do contexto de autenticação.
 * Gerencia o estado de autenticação, incluindo usuário, token e status de carregamento.
 * @param {AuthProviderProps} props - Propriedades do provedor.
 * @param {React.ReactNode} props.children - Componentes filhos que terão acesso ao contexto.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * @description Realiza o logout do usuário, limpando o estado e o `tokenStorage`.
   * A função é memoizada com `useCallback` para evitar recriações desnecessárias.
   */
  const logout = useCallback(() => {
    tokenStorage.remove()
    setToken(null)
    setUser(null)
  }, [])

  /**
   * @description Realiza o login do usuário, atualizando o estado e armazenando o novo token.
   * @param {string} newToken - O novo token JWT.
   * @param {User} newUser - Os dados do novo usuário.
   */
  const login = useCallback((newToken: string, newUser: User) => {
    tokenStorage.set(newToken)
    setToken(newToken)
    setUser(newUser)
  }, [])

  /**
   * Efeito para inicializar o estado de autenticação na montagem do componente.
   * Verifica se existe um token no `tokenStorage` e, em caso afirmativo,
   * busca os dados do usuário correspondente na API.
   */
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
          // Se a busca falhar (ex: token inválido), limpa o token.
          tokenStorage.remove()
          setToken(null)
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  /**
   * Efeito para registrar a função de logout no módulo da API.
   * Isso permite que o `fetchWithAuth` chame o logout automaticamente
   * em caso de erro 401/403.
   */
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

/**
 * @description Hook customizado para acessar o contexto de autenticação.
 * Simplifica o uso do `AuthContext` nos componentes da aplicação.
 * @returns {AuthContextData} O objeto de contexto de autenticação.
 * @throws {Error} Lança um erro se o hook for usado fora de um `AuthProvider`.
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }

  return context
}
