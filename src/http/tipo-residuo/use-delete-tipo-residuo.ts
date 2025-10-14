import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'

async function deleteTipoResiduo(id: number): Promise<void> {
  await fetchWithAuth(apiConfig.endpoints.tipoResiduo.byId(id), {
    method: 'DELETE',
  })
}

export function useDeleteTipoResiduo() {
  return useCrudMutation({
    mutationFn: deleteTipoResiduo,
    queryKey: queryKeys.tipoResiduo.all,
    successMessage: 'Tipo de Resíduo excluído com sucesso!',
    errorMessage: 'Erro ao excluir tipo de resíduo. Tente novamente.',
  })
}
