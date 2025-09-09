import { useMutation } from '@tanstack/react-query'
import type {
  SendLoginCodeError,
  SendLoginCodeRequest,
  SendLoginCodeResponse,
} from '@/http/types/send-login-code'

const VALID_EMAIL = 'oliver@gmail.com'
const MOCK_DELAY = 500

export function useSendLoginCode() {
  return useMutation<
    SendLoginCodeResponse,
    SendLoginCodeError,
    SendLoginCodeRequest
  >({
    mutationFn: (data: SendLoginCodeRequest) => {
      const mockResponse = new Promise<SendLoginCodeResponse>(
        (resolve, reject) => {
          setTimeout(() => {
            if (data.email !== VALID_EMAIL) {
              reject({
                erro: 'Email não encontrado, contate seu administrador',
              })
              return
            }

            resolve({
              mensagem: 'Código enviado com sucesso',
              email: data.email,
              tipo: data.type,
            })
          }, MOCK_DELAY)
        }
      )

      return mockResponse
    },
  })
}
