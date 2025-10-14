import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { GetUsuarioResponse } from './types'

async function getUsuario(id: number): Promise<GetUsuarioResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.usuarios.byId(id))
  return response.json()
}

export function useGetUsuario(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.usuarios.detail(id),
    queryFn: () => getUsuario(id),
    enabled: enabled && !!id,
  })
}
