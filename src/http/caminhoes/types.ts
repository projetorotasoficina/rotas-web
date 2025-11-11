export type TipoVeiculo =
  | 'VUC'
  | 'CAMINHAO_LEVE'
  | 'CAMINHAO_MEDIO'
  | 'CAMINHAO_PESADO'
  | 'CAMINHAO_CARRETA'

export type Caminhao = {
  id?: number
  modelo: string
  placa: string
  tipoColetaId: number
  residuoId: number
  tipoVeiculo: TipoVeiculo
  ativo: boolean
}

export type CaminhaoFormData = {
  id?: number
  modelo: string
  placa: string
  tipoColetaId: number
  residuoId: number
  tipoVeiculo: TipoVeiculo
  ativo: boolean
}

export type ListCaminhoesResponse = Caminhao[]

export type CreateCaminhaoRequest = CaminhaoFormData
export type CreateCaminhaoResponse = Caminhao

export type UpdateCaminhaoRequest = CaminhaoFormData
export type UpdateCaminhaoResponse = Caminhao

export type GetCaminhaoResponse = Caminhao

export type DeleteCaminhaoRequest = { id: number }
