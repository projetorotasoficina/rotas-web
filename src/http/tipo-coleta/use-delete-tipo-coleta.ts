import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'

async function deleteTipoColeta(id: number): Promise<void> {
  await fetchWithAuth(apiConfig.endpoints.tipoColeta.byId(id), {
    method: 'DELETE',
  })
}

export function useDeleteTipoColeta() {
  return useCrudMutation({
    mutationFn: deleteTipoColeta,
    queryKey: queryKeys.tipoColeta.all,
    successMessage: 'Tipo de Coleta excluído com sucesso!',
    errorMessage: 'Erro ao excluir tipo de coleta. Tente novamente.',
    additionalQueryKeys: [
      queryKeys.trajetos.all,
      queryKeys.trajetos.ultimo,
      queryKeys.rotas.all,
    ],
    refetchAdditionalQueries: true,
  })
}
