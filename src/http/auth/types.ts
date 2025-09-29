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

export type VerifyLoginCodeRequest = {
  email: string
  code: string
}

export type VerifyLoginCodeResponse = {
  token: string
  expiresIn: number
  user: {
    email: string
    nome: string
    authorities: string[]
  }
}

export type VerifyLoginCodeError = {
  erro: string
  status?: number
  timestamp?: string
}
