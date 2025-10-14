import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { CreateTipoColetaRequest, CreateTipoColetaResponse } from './types'

async function createTipoColeta(
  tipoColeta: CreateTipoColetaRequest
): Promise<CreateTipoColetaResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.tipoColeta.list, {
    method: 'POST',
    body: JSON.stringify(tipoColeta),
  })
  return response.json()
}

export function useCreateTipoColeta() {
  return useCrudMutation({
    mutationFn: createTipoColeta,
    queryKey: queryKeys.tipoColeta.all,
    successMessage: 'Tipo de Coleta criado com sucesso!',
    errorMessage: 'Erro ao criar tipo de coleta. Tente novamente.',
  })
}
