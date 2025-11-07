import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCrudMutation } from '@/hooks/use-crud-mutation'
import { ApiError } from '@/lib/errors'
import { showErrorToast } from '@/lib/toasts.tsx'

import { LoadingProvider } from '@/contexts/loading-context'

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

const TestComponent = ({ mutationFn, errorMessage }) => {
  const { mutate } = useCrudMutation({
    mutationFn,
    queryKey: ['test'],
    successMessage: 'Success!',
    errorMessage,
  })

  return <button onClick={() => mutate('test-data')}>Mutate</button>
}

const renderWithClient = (component) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>{component}</LoadingProvider>
    </QueryClientProvider>,
  )
}

describe('useCrudMutation', () => {
  it('should call showErrorToast with ApiError message on failure', async () => {
    const mutationFn = vi.fn().mockRejectedValue(new Error('Internal Server Error'))

    renderWithClient(
      <TestComponent
        mutationFn={mutationFn}
        errorMessage="Default error message"
      />,
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
        mutationFn={mutationFn}
        errorMessage="Default error message"
      />,
    )

    fireEvent.click(screen.getByText('Mutate'))

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith('Default error message')
    })
  })
})
