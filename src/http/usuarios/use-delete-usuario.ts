import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'

async function deleteUsuario(id: number): Promise<void> {
  await fetchWithAuth(apiConfig.endpoints.usuarios.byId(id), {
    method: 'DELETE',
  })
}

export function useDeleteUsuario() {
  return useCrudMutation({
    mutationFn: deleteUsuario,
    queryKey: queryKeys.usuarios.all,
    successMessage: 'Administrador excluído com sucesso!',
    errorMessage: 'Erro ao excluir administrador. Tente novamente.',
  })
}
