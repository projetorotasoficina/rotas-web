import { useMutation } from '@tanstack/react-query'
import type { ApiError } from '@/lib/errors'
import { apiConfig, fetchWithoutAuth } from '@/services/api'
import type { SendEmailLoginRequest, SendEmailLoginResponse } from './types'

export function useSendLoginCode() {
  return useMutation<SendEmailLoginResponse, ApiError, SendEmailLoginRequest>({
    mutationFn: (data: SendEmailLoginRequest) => {
      return fetchWithoutAuth(apiConfig.endpoints.auth.solicitarCodigo, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  })
}
