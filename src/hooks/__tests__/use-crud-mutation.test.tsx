import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { describe, expect, it, vi } from 'vitest'
import { LoadingProvider } from '@/contexts/loading-context'
import { useCrudMutation } from '@/hooks/use-crud-mutation'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
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
  it('should call toast.success on success', async () => {
    const mutationFn = vi.fn().mockResolvedValue({ id: 1 })

    renderWithClient(
      <TestComponent
        errorMessage="Default error message"
        mutationFn={mutationFn}
      />
    )

    fireEvent.click(screen.getByText('Mutate'))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Success!')
    })
  })

  it('should call toast.error with custom hook message on failure', async () => {
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
      expect(toast.error).toHaveBeenCalledWith(
        'Internal Server Error',
        expect.any(Object)
      )
    })
  })

  it('should call toast.error with default message for another error', async () => {
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
      expect(toast.error).toHaveBeenCalledWith(
        'Generic error',
        expect.any(Object)
      )
    })
  })
})
