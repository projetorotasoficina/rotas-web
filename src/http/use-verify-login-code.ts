import { useMutation } from '@tanstack/react-query'
import type {
  VerifyLoginCodeError,
  VerifyLoginCodeRequest,
  VerifyLoginCodeResponse,
} from '@/http/types/verify-login-code'
import { apiConfig } from '@/lib/api'

export function useVerifyLoginCode() {
  return useMutation<
    VerifyLoginCodeResponse,
    VerifyLoginCodeError,
    VerifyLoginCodeRequest
  >({
    mutationFn: async (data: VerifyLoginCodeRequest) => {
      try {
        const response = await fetch(apiConfig.endpoints.auth.loginOtp, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        const result = await response.json()

        if (!response.ok) {
          throw { ...result, status: response.status } as VerifyLoginCodeError
        }

        return result as VerifyLoginCodeResponse
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw {
            erro: 'Erro de conexão. Verifique sua internet',
            status: 0,
          } as VerifyLoginCodeError
        }
        throw error
      }
    },
  })
}
