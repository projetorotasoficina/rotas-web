import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchWithAuth } from '@/services/api'
import type { UpdateUsuarioRequest, UpdateUsuarioResponse } from './types'

async function updateUsuario({
  id,
  data,
}: {
  id: number
  data: UpdateUsuarioRequest
}): Promise<UpdateUsuarioResponse> {
  const response = await fetchWithAuth(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      toast.success('Administrador atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar administrador. Tente novamente.')
    },
  })
}
