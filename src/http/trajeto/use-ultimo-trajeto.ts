/** biome-ignore-all lint/style/noMagicNumbers: não necessário */
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { TrajetoComPontos } from './types'

async function getUltimoTrajeto(): Promise<TrajetoComPontos | null> {
  const trajetosResponse = await fetchWithAuth(
    apiConfig.endpoints.trajetos.list
  )
  const trajetos = await trajetosResponse.json()

  const trajetosFinalizados = trajetos.filter(
    (t: TrajetoComPontos) => t.status === 'FINALIZADO'
  )

  if (trajetosFinalizados.length === 0) {
    return null
  }

  const ultimoTrajeto = trajetosFinalizados.sort(
    (a: TrajetoComPontos, b: TrajetoComPontos) => {
      return (
        new Date(b.dataFim || 0).getTime() - new Date(a.dataFim || 0).getTime()
      )
    }
  )[0]

  const [pontosResponse, incidentesResponse] = await Promise.all([
    fetchWithAuth(apiConfig.endpoints.trajetos.pontos(ultimoTrajeto.id)),
    fetchWithAuth(apiConfig.endpoints.trajetos.incidentes(ultimoTrajeto.id)),
  ])

  const pontos = await pontosResponse.json()
  const incidentes = await incidentesResponse.json()

  return {
    ...ultimoTrajeto,
    pontos,
    incidentes,
  }
}

export function useUltimoTrajeto() {
  return useQuery({
    queryKey: queryKeys.trajetos.ultimo,
    queryFn: getUltimoTrajeto,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}
