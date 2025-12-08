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

export type PolygonGeoJson = {
  type: 'Polygon'
  coordinates: number[][][]
}

export type Rota = {
  id?: number
  nome: string
  ativo: boolean
  observacoes?: string
  tipoResiduoId: number
  tipoColetaId: number
  frequencias?: FrequenciaRota[]
  areaGeografica?: PolygonGeoJson | null
}

export type RotaFormData = {
  nome: string
  ativo: boolean
  observacoes?: string
  tipoResiduoId: number
  tipoColetaId: number
  frequencias?: FrequenciaRota[]
  areaGeografica?: PolygonGeoJson | null
}

export type ListRotasResponse = Rota[]

export type CreateRotaRequest = RotaFormData
export type CreateRotaResponse = Rota

export type UpdateRotaRequest = RotaFormData & { id: number }
export type UpdateRotaResponse = Rota

export type GetRotaResponse = Rota

export type DeleteRotaRequest = { id: number }

export type EstatisticasCobertura = {
  area_total_m2: number
  area_coberta_m2: number
  area_nao_coberta_m2: number
  percentual_cobertura: number
  quantidade_trajetos: number
  cobertura_completa: boolean
  status_cobertura: string
}

export type AreasNaoPercorridasDTO = {
  rota_id: number
  rota_nome: string
  // biome-ignore lint/suspicious/noExplicitAny: GeoJSON structure varies
  areas_nao_cobertas: any
  estatisticas: EstatisticasCobertura
  buffer_metros: number
}
