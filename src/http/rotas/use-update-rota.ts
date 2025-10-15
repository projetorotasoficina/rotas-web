import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { ApiError } from '@/lib/errors'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { UpdateRotaRequest, UpdateRotaResponse } from './types'

async function updateRota(
  rota: UpdateRotaRequest
): Promise<UpdateRotaResponse> {
  if (!rota.id) {
    throw new ApiError(400, 'ID é obrigatório para atualização')
  }

  const response = await fetchWithAuth(
    apiConfig.endpoints.rotas.byId(rota.id),
    {
      method: 'PUT',
      body: JSON.stringify(rota),
    }
  )
  return response.json()
}

export function useUpdateRota() {
  return useCrudMutation({
    mutationFn: updateRota,
    queryKey: queryKeys.rotas.all,
    successMessage: 'Rota atualizada com sucesso!',
    errorMessage: 'Erro ao atualizar rota. Tente novamente.',
  })
}
