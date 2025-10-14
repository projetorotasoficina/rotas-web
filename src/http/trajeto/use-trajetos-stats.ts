/** biome-ignore-all lint/style/noMagicNumbers: não necessário */
import { useQuery } from '@tanstack/react-query'
import { differenceInMinutes } from 'date-fns'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { Trajeto } from './types'

type TrajetosStats = {
  totalFinalizados: number
  emAndamento: number
  distanciaTotal: number
  duracaoMedia: number
}

async function getTrajetosStats(
  dataInicio?: Date,
  dataFim?: Date
): Promise<TrajetosStats> {
  const response = await fetchWithAuth(apiConfig.endpoints.trajetos.list)
  const trajetos: Trajeto[] = await response.json()

  const finalizados = trajetos.filter((t) => {
    if (t.status !== 'FINALIZADO') {
      return false
    }
    if (!(dataInicio && dataFim)) {
      return true
    }

    const trajetoDataFim = t.dataFim ? new Date(t.dataFim) : null
    if (!trajetoDataFim) {
      return false
    }

    return trajetoDataFim >= dataInicio && trajetoDataFim <= dataFim
  })

  const emAndamento = trajetos.filter((t) => t.status === 'EM_ANDAMENTO').length

  const distanciaTotal =
    finalizados.reduce((sum, t) => sum + (t.distanciaTotal || 0), 0) / 1000

  const duracoes = finalizados
    .filter((t) => t.dataInicio && t.dataFim)
    .map((t) =>
      // biome-ignore lint/style/noNonNullAssertion: dataFim já validado no filter acima
      differenceInMinutes(new Date(t.dataFim!), new Date(t.dataInicio))
    )

  const duracaoMedia =
    duracoes.length > 0
      ? duracoes.reduce((sum, d) => sum + d, 0) / duracoes.length
      : 0

  return {
    totalFinalizados: finalizados.length,
    emAndamento,
    distanciaTotal,
    duracaoMedia,
  }
}

export function useTrajetosStats(dataInicio?: Date, dataFim?: Date) {
  return useQuery({
    queryKey: queryKeys.trajetos.stats(dataInicio, dataFim),
    queryFn: () => getTrajetosStats(dataInicio, dataFim),
    staleTime: 1000 * 60 * 2, // 2 minutos
  })
}
