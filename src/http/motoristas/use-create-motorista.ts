import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { CreateMotoristaRequest, CreateMotoristaResponse } from './types'

async function createMotorista(
  motorista: CreateMotoristaRequest
): Promise<CreateMotoristaResponse> {
  const response = await fetchWithAuth(apiConfig.endpoints.motoristas.list, {
    method: 'POST',
    body: JSON.stringify(motorista),
  })
  return response.json()
}

export function useCreateMotorista() {
  return useCrudMutation({
    mutationFn: createMotorista,
    queryKey: queryKeys.motoristas.all,
    successMessage: 'Motorista criado com sucesso!',
    errorMessage: 'Erro ao criar motorista. Tente novamente.',
  })
}
