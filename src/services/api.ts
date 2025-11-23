

/**
 * @file Central de API e Requisições HTTP.
 * @description Este arquivo é o nú
 * 
 * cleo da comunicação com a API backend.
 * Ele define a URL base da API, exporta um objeto de configuração `apiConfig` com todos os endpoints
 * da aplicação e fornece funções `fetch` customizadas para realizar requisições HTTP.
 *
 * Inclui duas funções principais para requisições:
 * - `fetchWithoutAuth`: Para endpoints públicos que não exigem autenticação.
 * - `fetchWithAuth`: Para endpoints protegidos, que anexa automaticamente o token JWT
 *   (obtido do `tokenStorage`) no cabeçalho de autorização.
 *
 * O arquivo também implementa um mecanismo de callback de logout para deslogar o usuário
 * automaticamente em caso de respostas 401 (Unauthorized) ou 403 (Forbidden).
 */
import { StatusCodes } from 'http-status-codes'
import { ApiError, getErrorMessage } from '@/lib/errors'
import { tokenStorage } from './token-storage'

/**
 * @description URL base da API, obtida da variável de ambiente `VITE_API_BASE_URL`.
 * Se a variável não estiver definida, utiliza um valor padrão.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

/**
 * @description Callback a ser executado quando uma requisição resulta em erro de autenticação (401 ou 403).
 * É utilizado para acionar o logout global na aplicação.
 */
let logoutCallback: (() => void) | null = null

/**
 * @description Objeto de configuração que mapeia todos os endpoints da API.
 * Facilita a manutenção e o uso dos endpoints em toda a aplicação, evitando a repetição de strings de URL.
 */
export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    auth: {
      solicitarCodigo: '/auth/solicitar-codigo',
      loginOtp: '/auth/login-otp',
    },
    usuarios: {
      list: '/usuarios',
      meuPerfil: '/usuarios/meu-perfil',
      byId: (id: number) => `/usuarios/${id}`,
    },
    motoristas: {
      list: '/motoristas',
      byId: (id: number) => `/motoristas/${id}`,
    },
    caminhoes: {
      list: '/caminhoes',
      byId: (id: number) => `/caminhoes/${id}`,
    },
    tipoColeta: {
      list: '/tipocoleta',
      byId: (id: number) => `/tipocoleta/${id}`,
    },
    tipoResiduo: {
      list: '/tiporesiduo',
      byId: (id: number) => `/tiporesiduo/${id}`,
    },
    rotas: {
      list: '/rota',
      byId: (id: number) => `/rota/${id}`,
    },
    trajetos: {
      list: '/trajetos',
      byId: (id: number) => `/trajetos/${id}`,
      pontos: (id: number) => `/trajetos/${id}/pontos`,
      incidentes: (id: number) => `/trajetos/${id}/incidentes`,
    },
    codigosAtivacao: {
      list: '/codigosativacao',
      byId: (id: number) => `/codigosativacao/${id}`,
      gerar: '/codigosativacao/gerar',
    },
    appTokens: {
      list: '/apptokens',
      byId: (id: number) => `/apptokens/${id}`,
      revogar: (id: number) => `/apptokens/${id}/revogar`,
      reativar: (id: number) => `/apptokens/${id}/reativar`,
    },
  },
} as const

/**
 * @description Define a função de callback a ser chamada em caso de falha de autenticação.
 * Esta função é fornecida pelo `AuthContext` para garantir que o estado de autenticação seja limpo corretamente.
 * @param {() => void} callback - A função a ser executada no logout.
 */
export function setLogoutCallback(callback: () => void) {
  logoutCallback = callback
}

/**
 * @description Realiza uma requisição HTTP para endpoints públicos, sem enviar token de autenticação.
 * @param {string} url - A URL do endpoint (pode ser relativa ou absoluta).
 * @param {RequestInit} [options={}] - Opções da requisição `fetch` (método, corpo, etc.).
 * @returns {Promise<any>} Uma promessa que resolve com os dados da resposta em formato JSON.
 * @throws {ApiError} Lança um erro customizado `ApiError` em caso de falha na requisição (erros de rede ou status HTTP de erro).
 */
export async function fetchWithoutAuth(url: string, options: RequestInit = {}) {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new ApiError(
        response.status,
        result.erro || getErrorMessage(response.status),
        result.timestamp
      )
    }

    return result
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(0, 'Erro de conexão. Verifique sua internet')
    }
    throw new ApiError(500, 'Erro inesperado. Tente novamente.')
  }
}

/**
 * @description Realiza uma requisição HTTP para endpoints protegidos, incluindo o token de autenticação.
 * @param {string} url - A URL do endpoint (pode ser relativa ou absoluta).
 * @param {RequestInit} [options={}] - Opções da requisição `fetch` (método, corpo, etc.).
 * @returns {Promise<Response>} Uma promessa que resolve com o objeto `Response` original se a requisição for bem-sucedida.
 * @throws {ApiError} Lança um erro customizado `ApiError` em caso de falha. Se o status for 401 ou 403,
 * o callback de logout é chamado para deslogar o usuário.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = tokenStorage.get()

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })

  if (
    response.status === StatusCodes.UNAUTHORIZED ||
    response.status === StatusCodes.FORBIDDEN
  ) {
    if (logoutCallback) {
      logoutCallback()
    }
    throw new ApiError(
      response.status,
      getErrorMessage(response.status),
      'Token expired or unauthorized'
    )
  }

  if (!response.ok) {
    const errorMessage = getErrorMessage(response.status)
    throw new ApiError(
      response.status,
      errorMessage,
      `HTTP error! status: ${response.status}`
    )
  }

  return response
}
