import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { AreasNaoPercorridasDTO } from './types'

async function getAreasNaoPercorridas(
  rotaId: number,
  trajetoId?: number
): Promise<AreasNaoPercorridasDTO> {
  const url = apiConfig.endpoints.rotas.naoPercorridas(rotaId)
  const fullUrl = trajetoId ? `${url}?trajetoId=${trajetoId}` : url

  const response = await fetchWithAuth(fullUrl)
  return response.json()
}

type UseGetAreasNaoPercorridasOptions = Omit<
  UseQueryOptions<AreasNaoPercorridasDTO>,
  'queryKey' | 'queryFn'
>

export function useGetAreasNaoPercorridas(
  rotaId: number | undefined,
  trajetoId?: number,
  options?: UseGetAreasNaoPercorridasOptions
) {
  return useQuery({
    queryKey: rotaId
      ? queryKeys.rotas.areasNaoPercorridas(rotaId, trajetoId)
      : ['areas-nao-percorridas', undefined],
    // biome-ignore lint/style/noNonNullAssertion: enabled garante que rotaId existe
    queryFn: () => getAreasNaoPercorridas(rotaId!, trajetoId),
    enabled: !!rotaId,
    ...options,
  })
}
