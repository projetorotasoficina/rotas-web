export type DiaSemana =
  | 'SEGUNDA'
  | 'TERCA'
  | 'QUARTA'
  | 'QUINTA'
  | 'SEXTA'
  | 'SABADO'
  | 'DOMINGO'
export type Periodo = 'MANHA' | 'TARDE' | 'NOITE'

export type FrequenciaRota = {
  diaSemana: DiaSemana
  periodo: Periodo
}

export type Rota = {
  id?: number
  nome: string
  ativo: boolean
  observacoes?: string
  tipoResiduoId: number
  tipoColetaId: number
  frequencias?: FrequenciaRota[]
}

export type RotaFormData = {
  nome: string
  ativo: boolean
  observacoes?: string
  tipoResiduoId: number
  tipoColetaId: number
  frequencias?: FrequenciaRota[]
}

export type ListRotasResponse = Rota[]

export type CreateRotaRequest = RotaFormData
export type CreateRotaResponse = Rota

export type UpdateRotaRequest = RotaFormData & { id: number }
export type UpdateRotaResponse = Rota

export type GetRotaResponse = Rota

export type DeleteRotaRequest = { id: number }
