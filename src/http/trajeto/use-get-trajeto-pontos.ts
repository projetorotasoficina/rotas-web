import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { GetTrajetoPontosResponse } from './types'

async function getTrajetoPontos(id: number): Promise<GetTrajetoPontosResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.trajetos.pontos(id))
  return response.json()
}

type UseGetTrajetoPontosOptions = Omit<
  UseQueryOptions<GetTrajetoPontosResponse>,
  'queryKey' | 'queryFn'
>

export function useGetTrajetoPontos(
  id: number | undefined,
  options?: UseGetTrajetoPontosOptions
) {
  return useQuery({
    queryKey: id
      ? queryKeys.trajetos.pontos(id)
      : ['trajeto-pontos', undefined],
    // biome-ignore lint/style/noNonNullAssertion: enabled garante que id existe
    queryFn: () => getTrajetoPontos(id!),
    enabled: !!id,
    ...options,
  })
}
