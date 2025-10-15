export type Rota = {
  id?: number
  nome: string
  ativo: boolean
  observacoes?: string
  tipoResiduoId: number
  tipoColetaId: number
}

export type RotaFormData = {
  nome: string
  ativo: boolean
  observacoes?: string
  tipoResiduoId: number
  tipoColetaId: number
}

export type ListRotasResponse = Rota[]

export type CreateRotaRequest = RotaFormData
export type CreateRotaResponse = Rota

export type UpdateRotaRequest = RotaFormData & { id: number }
export type UpdateRotaResponse = Rota

export type GetRotaResponse = Rota

export type DeleteRotaRequest = { id: number }
