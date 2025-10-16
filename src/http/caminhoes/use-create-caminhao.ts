import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { CreateCaminhaoRequest, CreateCaminhaoResponse } from './types'

async function createCaminhao(
  caminhao: CreateCaminhaoRequest
): Promise<CreateCaminhaoResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.caminhoes.list, {
    method: 'POST',
    body: JSON.stringify(caminhao),
  })
  return response.json()
}

export function useCreateCaminhao() {
  return useCrudMutation({
    mutationFn: createCaminhao,
    queryKey: queryKeys.caminhoes.all,
    successMessage: 'Caminhão criado com sucesso!',
    errorMessage: 'Erro ao criar caminhão. Tente novamente.',
  })
}
