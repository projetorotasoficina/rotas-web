export type TipoColeta = {
  id?: number
  nome: string
}

export type TipoColetaFormData = {
  id?: number
  nome: string
}

export type ListTipoColetaResponse = TipoColeta[]

export type CreateTipoColetaRequest = TipoColetaFormData
export type CreateTipoColetaResponse = TipoColeta

export type UpdateTipoColetaRequest = TipoColetaFormData
export type UpdateTipoColetaResponse = TipoColeta

export type GetTipoColetaResponse = TipoColeta

export type DeleteTipoColetaRequest = { id: number }
