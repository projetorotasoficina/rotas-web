import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type {
  CreateTipoResiduoRequest,
  CreateTipoResiduoResponse,
} from './types'

async function createTipoResiduo(
  tipoResiduo: CreateTipoResiduoRequest
): Promise<CreateTipoResiduoResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.tipoResiduo.list, {
    method: 'POST',
    body: JSON.stringify(tipoResiduo),
  })
  return response.json()
}

export function useCreateTipoResiduo() {
  return useCrudMutation({
    mutationFn: createTipoResiduo,
    queryKey: queryKeys.tipoResiduo.all,
    successMessage: 'Tipo de Resíduo criado com sucesso!',
    errorMessage: 'Erro ao criar tipo de resíduo. Tente novamente.',
  })
}
