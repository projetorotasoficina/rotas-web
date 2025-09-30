import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchWithAuth } from '@/services/api'

async function deleteUsuario(id: number): Promise<void> {
  await fetchWithAuth(`/usuarios/${id}`, {
    method: 'DELETE',
  })
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      toast.success('Administrador excluído com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao excluir administrador. Tente novamente.')
    },
  })
}
