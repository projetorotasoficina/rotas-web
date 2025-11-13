import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useLoading } from '@/contexts/loading-context'
import { showErrorToast } from '@/lib/toasts'

type UseCrudMutationOptions<TData, TVariables> = {
  mutationFn: (data: TVariables) => Promise<TData>
  queryKey: readonly string[]
  successMessage: string
  errorMessage: string
  onSuccessCallback?: (data: TData, variables: TVariables) => void
  additionalQueryKeys?: readonly (readonly string[])[]
  refetchAdditionalQueries?: boolean
}

export function useCrudMutation<TData, TVariables>({
  mutationFn,
  queryKey,
  successMessage,
  errorMessage,
  onSuccessCallback,
  additionalQueryKeys,
  refetchAdditionalQueries = false,
}: UseCrudMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient()
  const { startLoading, stopLoading } = useLoading()

  return useMutation({
    mutationFn: async (data: TVariables) => {
      const loadingId = startLoading()
      try {
        return await mutationFn(data)
      } finally {
        stopLoading(loadingId)
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey })

      if (additionalQueryKeys) {
        for (const key of additionalQueryKeys) {
          if (refetchAdditionalQueries) {
            queryClient.refetchQueries({ queryKey: key })
          } else {
            queryClient.invalidateQueries({ queryKey: key })
          }
        }
      }

      toast.success(successMessage)
      if (onSuccessCallback) {
        onSuccessCallback(data, variables)
      }
    },
    onError: (error: Error) => {
      const message = error.message || errorMessage
      showErrorToast(message)
    },
  })
}
