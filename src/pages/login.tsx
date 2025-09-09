import { Recycle } from 'lucide-react'
import { useState } from 'react'
import imgLogin from '@/assets/loginImage.svg'
import { CodeVerificationForm } from '@/components/code-verification-form'
import { EmailForm } from '@/components/email-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useSendLoginCode } from '@/http/use-send-login-code'
import { useVerifyLoginCode } from '@/http/use-verify-login-code'

const SUCCESS_REDIRECT_DELAY = 500

export function LoginPage() {
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [codeError, setCodeError] = useState<string | null>(null)

  const sendCodeMutation = useSendLoginCode()
  const verifyCodeMutation = useVerifyLoginCode()

  function handleSubmitEmail(email: string) {
    setEmailError(null)
    setCodeError(null)

    sendCodeMutation.mutate(
      { email, type: 'OTP_AUTENTICACAO' },
      {
        onSuccess: () => {
          setUserEmail(email)
          setIsCodeSent(true)
          setEmailError(null)
        },
        onError: (apiError) => {
          setEmailError(apiError.erro || 'Erro ao enviar código')
        },
      }
    )
  }

  function handleVerifyCode(code: string) {
    setCodeError(null)

    verifyCodeMutation.mutate(
      { email: userEmail, type: 'OTP_AUTENTICACAO', code },
      {
        onSuccess: (data) => {
          if (data.valid && data.user && data.token) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))

            setTimeout(() => {
              window.location.href = '/'
            }, SUCCESS_REDIRECT_DELAY)
          }
        },
        onError: (apiError) => {
          setCodeError(apiError.erro || 'Erro ao verificar código')
        },
      }
    )
  }

  function handleBackToEmail() {
    setIsCodeSent(false)
    setEmailError(null)
    setCodeError(null)
    sendCodeMutation.reset()
    verifyCodeMutation.reset()
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Recycle className="size-4" />
          </div>
          GeoColeta
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-96">
            <Card className="w-full max-w-md border-0 shadow-none">
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
                    isLoading={sendCodeMutation.isPending}
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
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          src={imgLogin}
        />
      </div>
    </div>
  )
}
