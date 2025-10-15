import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { ListRotasResponse } from './types'

async function listRotas(): Promise<ListRotasResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.rotas.list)
  return response.json()
}

export function useListRotas() {
  return useQuery({
    queryKey: queryKeys.rotas.all,
    queryFn: listRotas,
  })
}
