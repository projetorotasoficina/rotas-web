import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { ListMotoristasResponse } from './types'

async function listMotoristas(): Promise<ListMotoristasResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.motoristas.list)
  return response.json()
}

export function useListMotoristas() {
  return useQuery({
    queryKey: queryKeys.motoristas.all,
    queryFn: listMotoristas,
  })
}
