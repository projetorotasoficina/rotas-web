/** biome-ignore-all lint/performance/noNamespaceImport: não necessário para testes */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/contexts/auth-context'
import { LoadingProvider } from '@/contexts/loading-context'
import * as useRole from '@/hooks/use-role'
import * as usePaginatedTipoResiduo from '@/http/tipo-residuo/use-paginated-tipo-residuo'
import { mockUseRole } from '@/test/test-utils'
import TipoResiduoPage from '../tipo-residuo'

const queryClient = new QueryClient()

vi.mock('@/http/tipo-residuo/use-paginated-tipo-residuo')
vi.mock('@/hooks/use-role')

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoadingProvider>
          <TipoResiduoPage />
        </LoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('TipoResiduoPage', () => {
  it('should render a list of residue types', async () => {
    vi.spyOn(
      usePaginatedTipoResiduo,
      'usePaginatedTipoResiduo'
    ).mockReturnValue({
      data: {
        content: [
          { id: 1, nome: 'Resíduo Orgânico', corHex: '#00FF00' },
          { id: 2, nome: 'Resíduo Reciclável', corHex: '#0000FF' },
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
      expect(screen.getByText('Resíduo Orgânico')).toBeInTheDocument()
      expect(screen.getByText('Resíduo Reciclável')).toBeInTheDocument()
    })

    expect(screen.getAllByText('1')[0]).toBeInTheDocument()
    expect(screen.getAllByText('2')[0]).toBeInTheDocument()
    expect(screen.getByTitle('#00FF00')).toBeInTheDocument()
    expect(screen.getByTitle('#0000FF')).toBeInTheDocument()
  })
})
