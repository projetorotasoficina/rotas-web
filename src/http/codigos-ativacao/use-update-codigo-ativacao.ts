import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { ApiError } from '@/lib/errors'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type {
  UpdateCodigoAtivacaoRequest,
  UpdateCodigoAtivacaoResponse,
} from './types'

async function updateCodigoAtivacao(
  codigoAtivacao: UpdateCodigoAtivacaoRequest
): Promise<UpdateCodigoAtivacaoResponse> {
  if (!codigoAtivacao.id) {
    throw new ApiError(400, 'ID é obrigatório para atualização')
  }

  const response = await fetchWithAuth(
    apiConfig.endpoints.codigosAtivacao.byId(codigoAtivacao.id),
    {
      method: 'PUT',
      body: JSON.stringify(codigoAtivacao),
    }
  )
  return response.json()
}

export function useUpdateCodigoAtivacao() {
  return useCrudMutation({
    mutationFn: updateCodigoAtivacao,
    queryKey: queryKeys.codigosAtivacao.all,
    successMessage: 'Código de ativação atualizado com sucesso!',
    errorMessage: 'Erro ao atualizar código de ativação. Tente novamente.',
  })
}
