export type VerifyLoginCodeRequest = {
  email: string
  type: 'OTP_AUTENTICACAO' | 'OTP_CADASTRO' | 'OTP_RECUPERACAO'
  code: string
}

export type VerifyLoginCodeResponse = {
  valid: boolean
  user?: {
    id: number
    nome: string
    email: string
    cpf: string
    telefone?: string
    ativo: boolean
    roles: string[]
  }
  token?: string
}

export type VerifyLoginCodeError = {
  erro: string
}
