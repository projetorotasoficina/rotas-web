import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchWithAuth } from '@/services/api'
import type { UpdateTipoColetaRequest, UpdateTipoColetaResponse } from './types'

async function updateTipoColeta({
  id,
  data,
}: {
  id: number
  data: UpdateTipoColetaRequest
}): Promise<UpdateTipoColetaResponse> {
  const response = await fetchWithAuth(`/tipocoleta/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export function useUpdateTipoColeta() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTipoColeta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipo-coleta'] })
      toast.success('Tipo de Coleta atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar tipo de coleta. Tente novamente.')
    },
  })
}
