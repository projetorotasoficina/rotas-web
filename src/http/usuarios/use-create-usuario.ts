import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchWithAuth } from '@/services/api'
import type { CreateUsuarioRequest, CreateUsuarioResponse } from './types'

async function createUsuario(
  usuario: CreateUsuarioRequest
): Promise<CreateUsuarioResponse> {
  const response = await fetchWithAuth('/usuarios', {
    method: 'POST',
    body: JSON.stringify(usuario),
  })
  return response.json()
}

export function useCreateUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      toast.success('Administrador criado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar administrador. Tente novamente.')
    },
  })
}
