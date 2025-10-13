import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchWithAuth } from '@/services/api'

async function deleteTipoColeta(id: number): Promise<void> {
  await fetchWithAuth(`/tipocoleta/${id}`, {
    method: 'DELETE',
  })
}

export function useDeleteTipoColeta() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTipoColeta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipo-coleta'] })
      toast.success('Tipo de Coleta excluído com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao excluir tipo de coleta. Tente novamente.')
    },
  })
}
