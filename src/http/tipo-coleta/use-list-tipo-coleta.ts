import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { ListTipoColetaResponse } from './types'

async function listTipoColeta(): Promise<ListTipoColetaResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.tipoColeta.list)
  return response.json()
}

export function useListTipoColeta() {
  return useQuery({
    queryKey: queryKeys.tipoColeta.all,
    queryFn: listTipoColeta,
  })
}
