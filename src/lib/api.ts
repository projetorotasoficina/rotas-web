const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    auth: {
      solicitarCodigo: `${API_BASE_URL}/api/auth/solicitar-codigo`,
      loginOtp: `${API_BASE_URL}/api/auth/login-otp`,
    },
  },
} as const

export { API_BASE_URL }
