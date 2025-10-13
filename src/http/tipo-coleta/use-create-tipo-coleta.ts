import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchWithAuth } from '@/services/api'
import type { CreateTipoColetaRequest, CreateTipoColetaResponse } from './types'

async function createTipoColeta(
  tipoColeta: CreateTipoColetaRequest
): Promise<CreateTipoColetaResponse> {
  const response = await fetchWithAuth('/tipocoleta', {
    method: 'POST',
    body: JSON.stringify(tipoColeta),
  })
  return response.json()
}

export function useCreateTipoColeta() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTipoColeta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipo-coleta'] })
      toast.success('Tipo de Coleta criado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar tipo de coleta. Tente novamente.')
    },
  })
}
