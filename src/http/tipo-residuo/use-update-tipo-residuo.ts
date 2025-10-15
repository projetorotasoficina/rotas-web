import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { ApiError } from '@/lib/errors'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type {
  UpdateTipoResiduoRequest,
  UpdateTipoResiduoResponse,
} from './types'

async function updateTipoResiduo(
  tipoResiduo: UpdateTipoResiduoRequest
): Promise<UpdateTipoResiduoResponse> {
  if (!tipoResiduo.id) {
    throw new ApiError(400, 'ID é obrigatório para atualização')
  }

  const response = await fetchWithAuth(
    apiConfig.endpoints.tipoResiduo.byId(tipoResiduo.id),
    {
      method: 'PUT',
      body: JSON.stringify(tipoResiduo),
    }
  )
  return response.json()
}

export function useUpdateTipoResiduo() {
  return useCrudMutation({
    mutationFn: updateTipoResiduo,
    queryKey: queryKeys.tipoResiduo.all,
    successMessage: 'Tipo de Resíduo atualizado com sucesso!',
    errorMessage: 'Erro ao atualizar tipo de resíduo. Tente novamente.',
  })
}
