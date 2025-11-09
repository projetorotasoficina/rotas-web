import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LoadingProvider } from '@/contexts/loading-context'
import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { showErrorToast } from '@/lib/toasts.tsx'

vi.mock('@/lib/toasts', () => ({
  showErrorToast: vi.fn(),
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const TestComponent = ({
  mutationFn,
  errorMessage,
}: {
  mutationFn: (data: string) => Promise<unknown>
  errorMessage: string
}) => {
  const { mutate } = useCrudMutation({
    mutationFn,
    queryKey: ['test'],
    successMessage: 'Success!',
    errorMessage,
  })

  return (
    <button onClick={() => mutate('test-data')} type="button">
      Mutate
    </button>
  )
}

const renderWithClient = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>{component}</LoadingProvider>
    </QueryClientProvider>
  )
}

describe('useCrudMutation', () => {
  it('should call showErrorToast with ApiError message on failure', async () => {
    const mutationFn = vi
      .fn()
      .mockRejectedValue(new Error('Internal Server Error'))

    renderWithClient(
      <TestComponent
        errorMessage="Default error message"
        mutationFn={mutationFn}
      />
    )

    fireEvent.click(screen.getByText('Mutate'))

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith('Internal Server Error')
    })
  })

  it('should call showErrorToast with default message for non-ApiError', async () => {
    const error = new Error('Generic error')
    const mutationFn = vi.fn().mockRejectedValue(error)

    renderWithClient(
      <TestComponent
        errorMessage="Default error message"
        mutationFn={mutationFn}
      />
    )

    fireEvent.click(screen.getByText('Mutate'))

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith('Generic error')
    })
  })
})
