import { useQuery } from '@tanstack/react-query'

import { fetchWithAuth } from '@/services/api'

import type { ListMotoristasResponse } from './types'

async function listMotoristas(): Promise<ListMotoristasResponse> {
  const response = await fetchWithAuth('/motoristas')
  return response.json()
}

export function useListMotoristas() {
  return useQuery({
    queryKey: ['motoristas'],
    queryFn: listMotoristas,
  })
}
