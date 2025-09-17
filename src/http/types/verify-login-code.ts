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
    authorithies: string[]
  }
}

export type VerifyLoginCodeError = {
  erro: string
  status?: number
  timestamp?: string
}
