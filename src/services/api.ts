import { StatusCodes } from 'http-status-codes'
import { ApiError, getErrorMessage } from '@/lib/errors'
import { tokenStorage } from './token-storage'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

let logoutCallback: (() => void) | null = null

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
  },
} as const

export function setLogoutCallback(callback: () => void) {
  logoutCallback = callback
}

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
