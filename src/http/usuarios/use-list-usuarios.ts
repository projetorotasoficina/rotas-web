import { useQuery } from '@tanstack/react-query'
import { fetchWithAuth } from '@/services/api'
import type { ListUsuariosResponse } from './types'

async function listUsuarios(): Promise<ListUsuariosResponse> {
  const response = await fetchWithAuth('/usuarios')
  return response.json()
}

export function useListUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: listUsuarios,
  })
}
