export type SendLoginCodeRequest = {
  email: string
  type: 'OTP_AUTENTICACAO' | 'OTP_CADASTRO' | 'OTP_RECUPERACAO'
}

export type SendLoginCodeResponse = {
  mensagem: string
  email: string
  tipo: string
}

export type SendLoginCodeError = {
  erro: string
}
