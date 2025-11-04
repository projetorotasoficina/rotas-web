import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'
import type { GerarCodigoResponse } from './types'

async function gerarCodigoAtivacao(): Promise<GerarCodigoResponse> {
  const response = await fetchWithAuth(
    apiConfig.endpoints.codigosAtivacao.gerar,
    {
      method: 'POST',
    }
  )
  return response.json()
}

export function useGerarCodigoAtivacao() {
  return useCrudMutation({
    mutationFn: gerarCodigoAtivacao,
    queryKey: queryKeys.codigosAtivacao.all,
    successMessage: 'Código de ativação gerado com sucesso!',
    errorMessage: 'Erro ao gerar código de ativação. Tente novamente.',
  })
}
