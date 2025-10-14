import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { ListTipoResiduoResponse } from './types'

async function listTipoResiduo(): Promise<ListTipoResiduoResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.tipoResiduo.list)
  return response.json()
}

export function useListTipoResiduo() {
  return useQuery({
    queryKey: queryKeys.tipoResiduo.all,
    queryFn: listTipoResiduo,
  })
}
