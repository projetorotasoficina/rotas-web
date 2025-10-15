import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { CreateRotaRequest, CreateRotaResponse } from './types'

async function createRota(
  rota: CreateRotaRequest
): Promise<CreateRotaResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.rotas.list, {
    method: 'POST',
    body: JSON.stringify(rota),
  })
  return response.json()
}

export function useCreateRota() {
  return useCrudMutation({
    mutationFn: createRota,
    queryKey: queryKeys.rotas.all,
    successMessage: 'Rota criada com sucesso!',
    errorMessage: 'Erro ao criar rota. Tente novamente.',
  })
}
