import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { UpdateTipoColetaRequest, UpdateTipoColetaResponse } from './types'

async function updateTipoColeta({
  id,
  data,
}: {
  id: number
  data: UpdateTipoColetaRequest
}): Promise<UpdateTipoColetaResponse> {
  const response = await fetchWithAuth(
    apiConfig.endpoints.tipoColeta.byId(id),
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  )
  return response.json()
}

export function useUpdateTipoColeta() {
  return useCrudMutation({
    mutationFn: updateTipoColeta,
    queryKey: queryKeys.tipoColeta.all,
    successMessage: 'Tipo de Coleta atualizado com sucesso!',
    errorMessage: 'Erro ao atualizar tipo de coleta. Tente novamente.',
  })
}
