import { useMutation } from '@tanstack/react-query'
import type { ApiError } from '@/lib/errors'
import { apiConfig, fetchWithoutAuth } from '@/services/api'
import type { VerifyLoginCodeRequest, VerifyLoginCodeResponse } from './types'

export function useVerifyLoginCode() {
  return useMutation<VerifyLoginCodeResponse, ApiError, VerifyLoginCodeRequest>(
    {
      mutationFn: (data: VerifyLoginCodeRequest) => {
        return fetchWithoutAuth(apiConfig.endpoints.auth.loginOtp, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
    }
  )
}
