import { useMutation } from '@tanstack/react-query'
import type {
  VerifyLoginCodeError,
  VerifyLoginCodeRequest,
  VerifyLoginCodeResponse,
} from '@/http/types/verify-login-code'

const MOCK_DELAY = 500
const VALID_CODE = '1234'

export function useVerifyLoginCode() {
  return useMutation<
    VerifyLoginCodeResponse,
    VerifyLoginCodeError,
    VerifyLoginCodeRequest
  >({
    mutationFn: (data: VerifyLoginCodeRequest) => {
      const mockResponse = new Promise<VerifyLoginCodeResponse>(
        (resolve, reject) => {
          setTimeout(() => {
            if (data.code !== VALID_CODE) {
              reject({ erro: 'Código inválido ou expirado' })
              return
            }

            resolve({
              valid: true,
              user: {
                id: 1,
                nome: 'Usuário Teste',
                email: data.email,
                cpf: '12345678901',
                telefone: '(41) 99999-9999',
                ativo: true,
                roles: ['ADMIN'],
              },
              token: `mock-jwt-token-${Date.now()}`,
            })
          }, MOCK_DELAY)
        }
      )

      return mockResponse
    },
  })
}
