import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { ApiError } from '@/lib/errors'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { UpdateCaminhaoRequest, UpdateCaminhaoResponse } from './types'

async function updateCaminhao(
  caminhao: UpdateCaminhaoRequest
): Promise<UpdateCaminhaoResponse> {
  if (!caminhao.id) {
    throw new ApiError(400, 'ID é obrigatório para atualização')
  }

  const response = await fetchWithAuth(
    apiConfig.endpoints.caminhoes.byId(caminhao.id),
    {
      method: 'PUT',
      body: JSON.stringify(caminhao),
    }
  )
  return response.json()
}

export function useUpdateCaminhao() {
  return useCrudMutation({
    mutationFn: updateCaminhao,
    queryKey: queryKeys.caminhoes.all,
    successMessage: 'Caminhão atualizado com sucesso!',
    errorMessage: 'Erro ao atualizar caminhão. Tente novamente.',
  })
}
