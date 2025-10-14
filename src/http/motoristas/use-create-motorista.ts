import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchWithAuth } from '@/services/api'

import type { CreateMotoristaRequest, CreateMotoristaResponse } from './types'

async function createMotorista(
  data: CreateMotoristaRequest,
): Promise<CreateMotoristaResponse> {
  const response = await fetchWithAuth('/motoristas', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export function useCreateMotorista() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMotorista,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoristas'] })
      toast.success('Motorista adicionado com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao adicionar motorista', {
        description: error.message,
      })
    },
  })
}
