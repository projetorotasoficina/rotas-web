import type { DiaSemana, Periodo } from '@/http/rotas/types'

export const DIA_SEMANA_LABEL: Record<DiaSemana, string> = {
  SEGUNDA: 'Segunda',
  TERCA: 'Terça',
  QUARTA: 'Quarta',
  QUINTA: 'Quinta',
  SEXTA: 'Sexta',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
}

export const PERIODO_LABEL: Record<Periodo, string> = {
  MANHA: 'Manhã',
  TARDE: 'Tarde',
  NOITE: 'Noite',
}

export const PERIODO_ICON: Record<Periodo, string> = {
  MANHA: '🌅',
  TARDE: '☀️',
  NOITE: '🌙',
}
