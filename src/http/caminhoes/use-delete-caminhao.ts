import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'

async function deleteCaminhao(id: number): Promise<void> {
  await fetchWithAuth(apiConfig.endpoints.caminhoes.byId(id), {
    method: 'DELETE',
  })
}

export function useDeleteCaminhao() {
  return useCrudMutation({
    mutationFn: deleteCaminhao,
    queryKey: queryKeys.caminhoes.all,
    successMessage: 'Caminhão excluído com sucesso!',
    errorMessage: 'Erro ao excluir caminhão. Tente novamente.',
  })
}
