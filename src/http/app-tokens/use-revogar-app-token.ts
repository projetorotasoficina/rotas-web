import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'

async function revogarAppToken(id: number): Promise<void> {
  await fetchWithAuth(apiConfig.endpoints.appTokens.revogar(id), {
    method: 'PUT',
  })
}

export function useRevogarAppToken() {
  return useCrudMutation({
    mutationFn: revogarAppToken,
    queryKey: queryKeys.appTokens.all,
    successMessage: 'Token revogado com sucesso!',
    errorMessage: 'Erro ao revogar token. Tente novamente.',
  })
}
