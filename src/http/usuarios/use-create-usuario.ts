import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { CreateUsuarioRequest, CreateUsuarioResponse } from './types'

async function createUsuario(
  usuario: CreateUsuarioRequest
): Promise<CreateUsuarioResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.usuarios.list, {
    method: 'POST',
    body: JSON.stringify(usuario),
  })
  return response.json()
}

export function useCreateUsuario() {
  return useCrudMutation({
    mutationFn: createUsuario,
    queryKey: queryKeys.usuarios.all,
    successMessage: 'Administrador criado com sucesso!',
    errorMessage: 'Erro ao criar administrador. Tente novamente.',
  })
}
