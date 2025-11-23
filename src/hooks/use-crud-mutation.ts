/**
 * @file Hook Genérico para Mutações de CRUD.
 * @description Este arquivo contém o hook `useCrudMutation`, uma abstração sobre o `useMutation`
 * do TanStack Query. Ele foi projetado para simplificar a lógica de operações de
 * Criação, Leitura, Atualização e Exclusão (CRUD), encapsulando o tratamento de
 * estado de carregamento, feedback ao usuário (via toasts) e invalidação de cache de query.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useLoading } from '@/contexts/loading-context'
import { ApiError } from '@/lib/errors'

/**
 * @description Define as opções para o hook `useCrudMutation`.
 * @template TData - O tipo de dado esperado como resposta da mutação.
 * @template TVariables - O tipo de dado passado como variáveis para a função de mutação.
 */
type UseCrudMutationOptions<TData, TVariables> = {
  /**
   * A função assíncrona que executa a mutação (ex: uma chamada de API para criar um item).
   * @param data As variáveis necessárias para a mutação.
   */
  mutationFn: (data: TVariables) => Promise<TData>
  /**
   * A chave de query a ser invalidada no TanStack Query após o sucesso da mutação.
   * Isso garante que os dados relacionados sejam recarregados.
   */
  queryKey: readonly string[]
  /**
   * Mensagem a ser exibida em um toast de sucesso.
   */
  successMessage: string
  /**
   * Mensagem de erro genérica a ser exibida em um toast de falha.
   * Se o erro for uma `ApiError`, a mensagem da API será usada.
   */
  errorMessage: string
  /**
   * Callback opcional a ser executado após o sucesso da mutação.
   * @param data Os dados retornados pela `mutationFn`.
   * @param variables As variáveis que foram passadas para a `mutationFn`.
   */
  onSuccessCallback?: (data: TData, variables: TVariables) => void
}

/**
 * @description Hook customizado que abstrai a lógica de mutações (criar, atualizar, deletar).
 * Ele gerencia o estado de carregamento global, exibe notificações de sucesso ou erro
 * e invalida as queries relevantes para manter os dados da UI atualizados.
 *
 * @template TData - O tipo de dado da resposta.
 * @template TVariables - O tipo de dado das variáveis da mutação.
 * @param {UseCrudMutationOptions<TData, TVariables>} options - As opções para configurar a mutação.
 * @returns O resultado da mutação do `useMutation`, que inclui a função `mutate` para disparar a operação.
 */
export function useCrudMutation<TData, TVariables>({
  mutationFn,
  queryKey,
  successMessage,
  errorMessage,
  onSuccessCallback,
}: UseCrudMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient()
  const { startLoading, stopLoading } = useLoading()

  return useMutation({
    /**
     * A função de mutação é envolvida para controlar o estado de carregamento global.
     */
    mutationFn: async (data: TVariables) => {
      startLoading()
      try {
        return await mutationFn(data)
      } finally {
        stopLoading()
      }
    },
    /**
     * Em caso de sucesso, invalida a query para forçar a atualização dos dados
     * e exibe uma notificação de sucesso.
     */
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey })
      toast.success(successMessage)
      if (onSuccessCallback) {
        onSuccessCallback(data, variables)
      }
    },
    /**
     * Em caso de erro, exibe uma notificação de erro.
     * Utiliza a mensagem da `ApiError` se disponível, caso contrário, usa a mensagem padrão.
     */
    onError: (error: Error) => {
      const message =
        error instanceof ApiError ? error.userMessage : errorMessage
      toast.error(message)
    },
  })
}
