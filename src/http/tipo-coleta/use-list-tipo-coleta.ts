import { useQuery } from '@tanstack/react-query'
import { fetchWithAuth } from '@/services/api'
import type { ListTipoColetaResponse } from './types'

async function listTipoColeta(): Promise<ListTipoColetaResponse> {
  const response = await fetchWithAuth('/tipocoleta')
  return response.json()
}

export function useListTipoColeta() {
  return useQuery({
    queryKey: ['tipo-coleta'],
    queryFn: listTipoColeta,
  })
}
