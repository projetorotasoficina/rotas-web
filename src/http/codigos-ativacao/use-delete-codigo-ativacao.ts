import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'

async function deleteCodigoAtivacao(id: number): Promise<void> {
  await fetchWithAuth(apiConfig.endpoints.codigosAtivacao.byId(id), {
    method: 'DELETE',
  })
}

export function useDeleteCodigoAtivacao() {
  return useCrudMutation({
    mutationFn: deleteCodigoAtivacao,
    queryKey: queryKeys.codigosAtivacao.all,
    successMessage: 'Código de ativação excluído com sucesso!',
    errorMessage: 'Erro ao excluir código de ativação. Tente novamente.',
  })
}
