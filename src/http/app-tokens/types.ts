export type AppToken = {
  id: number
  token: string
  deviceId: string
  ativo: boolean
  dataCriacao: string
  ultimoAcesso?: string | null
  totalAcessos: number
}

export type AppTokenFormData = {
  id?: number
  token?: string
  deviceId?: string
  ativo: boolean
  dataCriacao?: string
  ultimoAcesso?: string | null
  totalAcessos?: number
}

export type ListAppTokensResponse = AppToken[]

export type UpdateAppTokenRequest = AppTokenFormData
export type UpdateAppTokenResponse = AppToken

export type GetAppTokenResponse = AppToken

export type DeleteAppTokenRequest = { id: number }
