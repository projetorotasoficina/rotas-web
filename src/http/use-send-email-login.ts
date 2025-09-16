import { useMutation } from '@tanstack/react-query'
import { apiConfig } from '@/lib/api'
import type {
  SendEmailLoginError,
  SendEmailLoginRequest,
  SendEmailLoginResponse,
} from '@/http/types/send-email-login'

export function useSendLoginCode() {
  return useMutation<
    SendEmailLoginResponse,
    SendEmailLoginError,
    SendEmailLoginRequest
  >({
    mutationFn: async (data: SendEmailLoginRequest) => {
      const response = await fetch(
        apiConfig.endpoints.auth.solicitarCodigo,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw { ...result, status: response.status } as SendEmailLoginError
      }

      return result as SendEmailLoginResponse
    },
  })
}
