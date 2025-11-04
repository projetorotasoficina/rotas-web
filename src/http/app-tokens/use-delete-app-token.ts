import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'

async function deleteAppToken(id: number): Promise<void> {
  await fetchWithAuth(apiConfig.endpoints.appTokens.byId(id), {
    method: 'DELETE',
  })
}

export function useDeleteAppToken() {
  return useCrudMutation({
    mutationFn: deleteAppToken,
    queryKey: queryKeys.appTokens.all,
    successMessage: 'Token excluído com sucesso!',
    errorMessage: 'Erro ao excluir token. Tente novamente.',
  })
}
