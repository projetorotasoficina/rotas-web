import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'

async function deleteRota(id: number): Promise<void> {
  await fetchWithAuth(apiConfig.endpoints.rotas.byId(id), {
    method: 'DELETE',
  })
}

export function useDeleteRota() {
  return useCrudMutation({
    mutationFn: deleteRota,
    queryKey: queryKeys.rotas.all,
    successMessage: 'Rota excluída com sucesso!',
    errorMessage: 'Erro ao excluir rota. Tente novamente.',
  })
}
