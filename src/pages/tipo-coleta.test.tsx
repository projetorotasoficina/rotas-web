/** biome-ignore-all lint/performance/noNamespaceImport: não necessário para testes */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/contexts/auth-context'
import { LoadingProvider } from '@/contexts/loading-context'
import * as useRole from '@/hooks/use-role'
import * as usePaginatedTipoColeta from '@/http/tipo-coleta/use-paginated-tipo-coleta'
import { mockUseRole } from '@/test/test-utils'
import { TipoColetaPage } from './tipo-coleta'

const queryClient = new QueryClient()

vi.mock('@/http/tipo-coleta/use-paginated-tipo-coleta')
vi.mock('@/hooks/use-role')

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoadingProvider>
          <TipoColetaPage />
        </LoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('TipoColetaPage', () => {
  it('should render a list of collection types', async () => {
    vi.spyOn(usePaginatedTipoColeta, 'usePaginatedTipoColeta').mockReturnValue({
      data: {
        content: [
          { id: 1, nome: 'Coleta Seletiva' },
          { id: 2, nome: 'Coleta Orgânica' },
        ],
        totalPages: 1,
        totalElements: 2,
      },
      isLoading: false,
      isFetching: false,
    } as any)

    vi.spyOn(useRole, 'useRole').mockReturnValue(mockUseRole())

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Coleta Seletiva')).toBeInTheDocument()
      expect(screen.getByText('Coleta Orgânica')).toBeInTheDocument()
    })

    expect(screen.getAllByText('1')[0]).toBeInTheDocument()
    expect(screen.getAllByText('2')[0]).toBeInTheDocument()
  })
})
