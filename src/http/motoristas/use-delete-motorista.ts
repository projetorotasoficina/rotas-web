import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchWithAuth } from '@/services/api'

async function deleteMotorista(id: number): Promise<void> {
  await fetchWithAuth(`/motoristas/${id}`, {
    method: 'DELETE',
  })
}

export function useDeleteMotorista() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMotorista,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoristas'] })
      toast.success('Motorista excluído com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao excluir motorista', {
        description: error.message,
      })
    },
  })
}
