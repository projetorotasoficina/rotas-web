import { StatusCodes } from 'http-status-codes'

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
  },
} as const

export function setLogoutCallback(callback: () => void) {
  logoutCallback = callback
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = sessionStorage.getItem('token')

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
    throw new Error('Token expired or unauthorized')
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response
}

export async function validateToken(): Promise<boolean> {
  try {
    await fetchWithAuth(apiConfig.endpoints.usuarios.meuPerfil)
    return true
  } catch {
    return false
  }
}
