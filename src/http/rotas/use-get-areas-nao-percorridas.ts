import { useQuery } from '@tanstack/react-query'
import { apiConfig, fetchWithAuth } from '@/services/api'

export interface EstatisticasCobertura {
  area_total_m2: number
  area_coberta_m2: number
  area_nao_coberta_m2: number
  percentual_cobertura: number
  quantidade_trajetos: number
  cobertura_completa: boolean
  status_cobertura: string
}

export interface AreasNaoPercorridasDTO {
  rota_id: number
  rota_nome: string
  // biome-ignore lint/suspicious/noExplicitAny: GeoJSON structure varies
  areas_nao_cobertas: any
  estatisticas: EstatisticasCobertura
  buffer_metros: number
}

async function getAreasNaoPercorridas(
  rotaId: number,
  trajetoId?: number
): Promise<AreasNaoPercorridasDTO> {
  const url = new URL(
    `${apiConfig.baseUrl}${apiConfig.endpoints.rotas.naoPercorridas(rotaId)}`
  )
  if (trajetoId) {
    url.searchParams.append('trajetoId', String(trajetoId))
  }
  
  const response = await fetchWithAuth(url.toString())
  return response.json()
}

export function useGetAreasNaoPercorridas(
  rotaId: number | undefined,
  trajetoId?: number,
  options?: { enabled?: boolean; refetchInterval?: number | false }
) {
  return useQuery({
    queryKey: ['areas-nao-percorridas', rotaId, trajetoId],
    queryFn: () => getAreasNaoPercorridas(rotaId!, trajetoId),
    enabled: !!rotaId && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval,
  })
}
