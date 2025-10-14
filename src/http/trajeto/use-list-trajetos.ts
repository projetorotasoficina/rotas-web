import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { ListTrajetosResponse } from './types'

async function listTrajetos(): Promise<ListTrajetosResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.trajetos.list)
  return response.json()
}

export function useListTrajetos() {
  return useQuery({
    queryKey: queryKeys.trajetos.all,
    queryFn: listTrajetos,
  })
}
