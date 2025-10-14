export type TrajetoStatus = 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO'

export type TipoResiduo = {
  id: number
  nome: string
  corHex: string
}

export type PontoTrajeto = {
  id: number
  trajetoId: number
  latitude: number
  longitude: number
  horario: string
  observacao?: string
}

export type Trajeto = {
  id: number
  rotaId: number
  caminhaoId: number
  motoristaId: number
  dataInicio: string
  dataFim?: string
  distanciaTotal?: number
  status: TrajetoStatus
  tipoResiduo?: TipoResiduo
}

export type Incidente = {
  id: number
  trajetoId: number
  nome: string
  observacoes?: string
  ts: string
  lat?: number
  lng?: number
  fotoUrl?: string
}

export type TrajetoComPontos = Trajeto & {
  pontos: PontoTrajeto[]
  incidentes: Incidente[]
}

export type ListTrajetosResponse = Trajeto[]
export type GetTrajetoPontosResponse = PontoTrajeto[]
