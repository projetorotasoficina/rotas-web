import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { Trajeto } from './types'

async function getTrajeto(id: number): Promise<Trajeto> {
  const response = await fetchWithAuth(apiConfig.endpoints.trajetos.byId(id))
  return response.json()
}

export function useGetTrajeto(
  id: number,
  options?: Omit<UseQueryOptions<Trajeto>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.trajetos.detail(id),
    queryFn: () => getTrajeto(id),
    ...options,
  })
}
