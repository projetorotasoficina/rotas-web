/**
 * @file Página de Login.
 * @description Este arquivo define o componente `LoginPage`, responsável pela interface
 * e lógica de autenticação do usuário. O processo de login é dividido em duas etapas:
 * 1.  **Envio de E-mail**: O usuário insere seu e-mail. O componente `EmailForm` é usado
 *     para capturar o e-mail e a mutação `useSendLoginCode` é chamada para solicitar
 *     um código de verificação à API.
 * 2.  **Verificação de Código**: Após o envio do e-mail, a UI muda para o `CodeVerificationForm`.
 *     O usuário insere o código recebido, e a mutação `useVerifyLoginCode` é chamada.
 *     Se o código for válido, a API retorna um token JWT.
 *
 * Após receber o token, o componente busca os dados completos do usuário, chama a função `login`
 * do `AuthContext` para salvar o estado de autenticação globalmente e redireciona o usuário
 * para a página principal ('/').
 */
import { StatusCodes } from 'http-status-codes'
import { Recycle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import imgLogin from '@/assets/loginImage.svg'
import { CodeVerificationForm } from '@/components/forms/code-verification-form'
import { EmailForm } from '@/components/forms/email-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { useSendLoginCode } from '@/http/auth/use-send-email-login'
import { useVerifyLoginCode } from '@/http/auth/use-verify-login-code'
import type { ApiError } from '@/lib/errors'
import { apiConfig, fetchWithAuth } from '@/services/api'
import { tokenStorage } from '@/services/token-storage'

/**
 * @description Mapeia um erro da API para uma mensagem de erro amigável na etapa de envio de e-mail.
 * @param {ApiError} apiError - O erro retornado pela API.
 * @returns {string} A mensagem de erro para o usuário.
 */
function getEmailErrorMessage(apiError: ApiError): string {
  if (
    apiError.status === StatusCodes.NOT_FOUND ||
    apiError.status === StatusCodes.BAD_REQUEST
  ) {
    return 'Email não encontrado, contate o seu administrador'
  }

  if (apiError.status === StatusCodes.INTERNAL_SERVER_ERROR) {
    return 'Erro interno do servidor. Tente novamente mais tarde'
  }

  return apiError.userMessage
}

/**
 * @description Mapeia um erro da API para uma mensagem de erro amigável na etapa de verificação de código.
 * @param {ApiError} apiError - O erro retornado pela API.
 * @returns {string} A mensagem de erro para o usuário.
 */
function getCodeErrorMessage(apiError: ApiError): string {
  if (apiError.status === StatusCodes.INTERNAL_SERVER_ERROR) {
    return 'Erro interno do servidor. Tente novamente mais tarde'
  }

  if (apiError.status === StatusCodes.UNPROCESSABLE_ENTITY) {
    return 'Código inválido ou expirado'
  }

  return apiError.userMessage
}

/**
 * @description Componente que renderiza a página de login e gerencia o fluxo de autenticação.
 */
export function LoginPage() {
  // Estado para controlar qual etapa do formulário é exibida (e-mail ou código).
  const [isCodeSent, setIsCodeSent] = useState(false)
  // Armazena o e-mail do usuário após a primeira etapa.
  const [userEmail, setUserEmail] = useState('')
  // Estados para armazenar mensagens de erro específicas para cada formulário.
  const [emailError, setEmailError] = useState<string | null>(null)
  const [codeError, setCodeError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const sendLoginCodeMutation = useSendLoginCode()
  const verifyCodeMutation = useVerifyLoginCode()

  // Efeito para redirecionar o usuário para a home se ele já estiver autenticado.
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  /**
   * @description Lida com o envio do formulário de e-mail.
   * Chama a mutação para enviar o código de login.
   * @param {string} email - O e-mail fornecido pelo usuário.
   */
  function handleSubmitEmail(email: string) {
    setEmailError(null)
    setCodeError(null)

    sendLoginCodeMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setUserEmail(email)
          setIsCodeSent(true)
          setEmailError(null)
        },
        onError: (apiError) => {
          setEmailError(getEmailErrorMessage(apiError))
        },
      }
    )
  }

  /**
   * @description Lida com o envio do formulário de verificação de código.
   * Chama a mutação para verificar o código e, em caso de sucesso, autentica o usuário.
   * @param {string} code - O código de verificação fornecido pelo usuário.
   */
  function handleVerifyCode(code: string) {
    setCodeError(null)

    verifyCodeMutation.mutate(
      { email: userEmail, code },
      {
        onSuccess: async (data) => {
          if (data.token) {
            // Armazena o token para a próxima requisição.
            tokenStorage.set(data.token)
            try {
              // Busca os dados completos do usuário para salvar no contexto.
              const response = await fetchWithAuth(
                apiConfig.endpoints.usuarios.meuPerfil
              )
              const fullUser = await response.json()

              // Chama a função de login do contexto para finalizar a autenticação.
              login(data.token, fullUser)

              // Redireciona para a página inicial.
              navigate('/', { replace: true })
            } catch (_error) {
              setCodeError('Falha ao buscar dados do usuário.')
            }
          }
        },
        onError: (apiError) => {
          setCodeError(getCodeErrorMessage(apiError))
        },
      }
    )
  }

  /**
   * @description Permite ao usuário voltar da etapa de verificação de código para a de e-mail.
   * Reseta os estados relevantes.
   */
  function handleBackToEmail() {
    setIsCodeSent(false)
    setEmailError(null)
    setCodeError(null)
    sendLoginCodeMutation.reset()
    verifyCodeMutation.reset()
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-white">
            <Recycle className="size-4" />
          </div>
          GeoColeta
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-96">
            <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Acesse o GeoColeta</CardTitle>
                <CardDescription>
                  {isCodeSent
                    ? `Enviamos um código de verificação para ${userEmail}`
                    : 'Entre usando seu e-mail cadastrado'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isCodeSent ? (
                  <CodeVerificationForm
                    error={codeError}
                    isLoading={verifyCodeMutation.isPending}
                    onBack={handleBackToEmail}
                    onSubmit={handleVerifyCode}
                  />
                ) : (
                  <EmailForm
                    error={emailError}
                    isLoading={sendLoginCodeMutation.isPending}
                    onSubmit={handleSubmitEmail}
                  />
                )}

                <div className="mt-6 text-center text-muted-foreground text-sm">
                  Ao prosseguir, você concorda com nossos{' '}
                  <a className="underline underline-offset-4" href="/">
                    Termos de Uso
                  </a>{' '}
                  e{' '}
                  <a className="underline underline-offset-4" href="/">
                    Política de Privacidade
                  </a>
                  .
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          alt="truck"
          className="absolute inset-0 h-full w-full object-cover"
          src={imgLogin}
        />
      </div>
    </div>
  )
}
