import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { CodigoAtivacao } from './types'

async function revogarCodigoAtivacao(codigo: CodigoAtivacao): Promise<void> {
  if (!codigo.id) {
    throw new Error('ID é obrigatório para revogação')
  }

  await fetchWithAuth(apiConfig.endpoints.codigosAtivacao.byId(codigo.id), {
    method: 'PUT',
    body: JSON.stringify({ ...codigo, ativo: false }),
  })
}

export function useRevogarCodigoAtivacao() {
  return useCrudMutation({
    mutationFn: revogarCodigoAtivacao,
    queryKey: queryKeys.codigosAtivacao.all,
    successMessage: 'Código de ativação revogado com sucesso!',
    errorMessage: 'Erro ao revogar código de ativação. Tente novamente.',
  })
}
