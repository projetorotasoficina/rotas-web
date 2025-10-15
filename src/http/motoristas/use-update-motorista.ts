import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { ApiError } from '@/lib/errors'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { UpdateMotoristaRequest, UpdateMotoristaResponse } from './types'

async function updateMotorista(
  motorista: UpdateMotoristaRequest
): Promise<UpdateMotoristaResponse> {
  if (!motorista.id) {
    throw new ApiError(400, 'ID é obrigatório para atualização')
  }

  const response = await fetchWithAuth(
    apiConfig.endpoints.motoristas.byId(motorista.id),
    {
      method: 'PUT',
      body: JSON.stringify(motorista),
    }
  )
  return response.json()
}

export function useUpdateMotorista() {
  return useCrudMutation({
    mutationFn: updateMotorista,
    queryKey: queryKeys.motoristas.all,
    successMessage: 'Motorista atualizado com sucesso!',
    errorMessage: 'Erro ao atualizar motorista. Tente novamente.',
  })
}
