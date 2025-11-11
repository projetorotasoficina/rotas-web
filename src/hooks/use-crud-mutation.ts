import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useLoading } from '@/contexts/loading-context'
import { ApiError } from '@/lib/errors'

type UseCrudMutationOptions<TData, TVariables> = {
  mutationFn: (data: TVariables) => Promise<TData>
  queryKey: readonly string[]
  successMessage: string
  errorMessage: string
  onSuccessCallback?: (data: TData, variables: TVariables) => void
}

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
    mutationFn: async (data: TVariables) => {
      startLoading()
      try {
        return await mutationFn(data)
      } finally {
        stopLoading()
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey })
      toast.success(successMessage)
      if (onSuccessCallback) {
        onSuccessCallback(data, variables)
      }
    },
    onError: (error: Error) => {
      const message =
        error instanceof ApiError ? error.userMessage : errorMessage
      toast.error(message)
    },
  })
}
