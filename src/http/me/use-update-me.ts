import { useQueryClient } from '@tanstack/react-query'
import type { User } from '@/contexts/auth-context'
import { useAuth } from '@/contexts/auth-context'
import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig, fetchWithAuth } from '@/services/api'

type UpdateMeData = {
  nome: string
  telefone?: string | null
  cpf?: string | null
}

async function updateMe(data: UpdateMeData): Promise<User> {
  const response = await fetchWithAuth(apiConfig.endpoints.usuarios.meuPerfil, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export function useUpdateMe() {
  const queryClient = useQueryClient()
  const { login, user, token } = useAuth()

  return useCrudMutation({
    mutationFn: updateMe,
    queryKey: queryKeys.usuarios.me,
    successMessage: 'Usuário atualizado com sucesso!',
    errorMessage: 'Erro ao atualizar usuário.',
    onSuccessCallback: (data, variables) => {
      queryClient.setQueryData(queryKeys.usuarios.me, data)
      queryClient.invalidateQueries({ queryKey: queryKeys.usuarios.all })
      if (user && token) {
        login(token, {
          ...user,
          nome: variables.nome,
          telefone: variables.telefone ?? null,
          cpf: variables.cpf ?? null,
        })
      }
    },
  })
}
