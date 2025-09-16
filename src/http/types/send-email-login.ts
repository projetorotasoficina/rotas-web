export type SendEmailLoginRequest = {
  email: string
}

export type SendEmailLoginResponse = {
  mensagem: string
  email: string
  tipo: string
}

export type SendEmailLoginError = {
  erro: string
  status?: number
  timestamp?: string
}
