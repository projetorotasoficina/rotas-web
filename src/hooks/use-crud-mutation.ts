import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useLoading } from '@/contexts/loading-context'
import { ApiError } from '@/lib/errors'
import { showErrorToast } from '@/lib/toasts'

type UseCrudMutationOptions<TData, TVariables> = {
  mutationFn: (data: TVariables) => Promise<TData>
  queryKey: readonly string[]
  successMessage: string
  errorMessage: string
  onSuccessCallback?: () => void
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast.success(successMessage)
      if (onSuccessCallback) {
        onSuccessCallback()
      }
    },
    onError: (error: Error) => {
      const message = error.message || errorMessage
      showErrorToast(message)
    },
  })
}
