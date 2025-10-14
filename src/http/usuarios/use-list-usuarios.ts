import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { ListUsuariosResponse } from './types'

async function listUsuarios(): Promise<ListUsuariosResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.usuarios.list)
  return response.json()
}

export function useListUsuarios() {
  return useQuery({
    queryKey: queryKeys.usuarios.all,
    queryFn: listUsuarios,
  })
}
