import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { UpdateUsuarioRequest, UpdateUsuarioResponse } from './types'

async function updateUsuario({
  id,
  data,
}: {
  id: number
  data: UpdateUsuarioRequest
}): Promise<UpdateUsuarioResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.usuarios.byId(id), {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export function useUpdateUsuario() {
  return useCrudMutation({
    mutationFn: updateUsuario,
    queryKey: queryKeys.usuarios.all,
    successMessage: 'Administrador atualizado com sucesso!',
    errorMessage: 'Erro ao atualizar administrador. Tente novamente.',
  })
}
