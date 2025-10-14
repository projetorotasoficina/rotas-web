export type TipoResiduo = {
  id?: number
  nome: string
  corHex: string
}

export type TipoResiduoFormData = {
  id?: number
  nome: string
  corHex: string
}

export type ListTipoResiduoResponse = TipoResiduo[]

export type CreateTipoResiduoRequest = TipoResiduoFormData
export type CreateTipoResiduoResponse = TipoResiduo

export type UpdateTipoResiduoRequest = TipoResiduoFormData
export type UpdateTipoResiduoResponse = TipoResiduo

export type GetTipoResiduoResponse = TipoResiduo

export type DeleteTipoResiduoRequest = { id: number }
