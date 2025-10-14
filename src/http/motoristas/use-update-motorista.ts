import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchWithAuth } from '@/services/api'

import type { UpdateMotoristaRequest, UpdateMotoristaResponse } from './types'

async function updateMotorista({
  id,
  data,
}: { id: number, data: UpdateMotoristaRequest }): Promise<UpdateMotoristaResponse> {
  const response = await fetchWithAuth(`/motoristas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export function useUpdateMotorista() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMotorista,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoristas'] })
      toast.success('Motorista atualizado com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao atualizar motorista', {
        description: error.message,
      })
    },
  })
}
