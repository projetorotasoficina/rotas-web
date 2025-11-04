export type CodigoAtivacao = {
  id: number
  codigo: string
  usado: boolean
  dataGeracao: string
  dataUso?: string | null
  deviceId?: string | null
  ativo: boolean
}

export type CodigoAtivacaoFormData = {
  id?: number
  codigo?: string
  usado?: boolean
  dataGeracao?: string
  dataUso?: string | null
  deviceId?: string | null
  ativo: boolean
}

export type ListCodigosAtivacaoResponse = CodigoAtivacao[]

export type CreateCodigoAtivacaoRequest = CodigoAtivacaoFormData
export type CreateCodigoAtivacaoResponse = CodigoAtivacao

export type UpdateCodigoAtivacaoRequest = CodigoAtivacaoFormData
export type UpdateCodigoAtivacaoResponse = CodigoAtivacao

export type GetCodigoAtivacaoResponse = CodigoAtivacao

export type DeleteCodigoAtivacaoRequest = { id: number }

export type GerarCodigoResponse = {
  status: string
  codigo: string
  dataGeracao: string
}
