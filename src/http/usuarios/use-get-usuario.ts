import { useQuery } from '@tanstack/react-query'
import { fetchWithAuth } from '@/services/api'
import type { GetUsuarioResponse } from './types'

async function getUsuario(id: number): Promise<GetUsuarioResponse> {
  const response = await fetchWithAuth(`/usuarios/${id}`)
  return response.json()
}

export function useGetUsuario(id: number, enabled = true) {
  return useQuery({
    queryKey: ['usuario', id],
    queryFn: () => getUsuario(id),
    enabled: enabled && !!id,
  })
}
