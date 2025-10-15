import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'

async function deleteMotorista(id: number): Promise<void> {
  await fetchWithAuth(apiConfig.endpoints.motoristas.byId(id), {
    method: 'DELETE',
  })
}

export function useDeleteMotorista() {
  return useCrudMutation({
    mutationFn: deleteMotorista,
    queryKey: queryKeys.motoristas.all,
    successMessage: 'Motorista excluído com sucesso!',
    errorMessage: 'Erro ao excluir motorista. Tente novamente.',
  })
}
