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
import type { SendEmailLoginError } from '@/http/types/send-email-login'
import type { VerifyLoginCodeError } from '@/http/types/verify-login-code'
import { useSendLoginCode } from '@/http/use-send-email-login'
import { useVerifyLoginCode } from '@/http/use-verify-login-code'

const SUCCESS_REDIRECT_DELAY = 500

function getEmailErrorMessage(apiError: SendEmailLoginError): string {
  if (apiError.status === StatusCodes.BAD_REQUEST) {
    return 'Email deve ser institucional: @utfpr.edu.br ou @alunos.utfpr.edu.br'
  }

  if (apiError.status === StatusCodes.NOT_FOUND) {
    return 'Email não encontrado, contate o seu administrador'
  }

  if (apiError.status === StatusCodes.INTERNAL_SERVER_ERROR) {
    return 'Erro interno do servidor. Tente novamente mais tarde'
  }

  return apiError.erro.toString()
}

function getCodeErrorMessage(apiError: VerifyLoginCodeError): string {
  if (apiError.status === StatusCodes.INTERNAL_SERVER_ERROR) {
    return 'Erro interno do servidor. Tente novamente mais tarde'
  }

  if (apiError.status === StatusCodes.UNPROCESSABLE_ENTITY) {
    return 'Código inválido ou expirado'
  }

  return apiError.erro.toString()
}

export function LoginPage() {
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [codeError, setCodeError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const sendLoginCodeMutation = useSendLoginCode()
  const verifyCodeMutation = useVerifyLoginCode()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

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

  function handleVerifyCode(code: string) {
    setCodeError(null)

    verifyCodeMutation.mutate(
      { email: userEmail, code },
      {
        onSuccess: (data) => {
          if (data.user && data.token) {
            login(data.token, data.user)

            setTimeout(() => {
              navigate('/', { replace: true })
            }, SUCCESS_REDIRECT_DELAY)
          }
        },
        onError: (apiError) => {
          setCodeError(getCodeErrorMessage(apiError))
        },
      }
    )
  }

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
