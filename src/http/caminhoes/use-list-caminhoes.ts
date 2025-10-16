import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { ListCaminhoesResponse } from './types'

async function listCaminhoes(): Promise<ListCaminhoesResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.caminhoes.list)
  return response.json()
}

export function useListCaminhoes() {
  return useQuery({
    queryKey: queryKeys.caminhoes.all,
    queryFn: listCaminhoes,
  })
}
