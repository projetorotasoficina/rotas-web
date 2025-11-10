import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/contexts/auth-context'
import { LoadingProvider } from '@/contexts/loading-context'
import * as usePaginatedRotas from '@/http/rotas/use-paginated-rotas'
import * as useListTipoColeta from '@/http/tipo-coleta/use-list-tipo-coleta'
import * as useListTipoResiduo from '@/http/tipo-residuo/use-list-tipo-residuo'
import * as useRole from '@/hooks/use-role'
import { RotasPage } from './rotas'

const queryClient = new QueryClient()

vi.mock('@/http/rotas/use-paginated-rotas')
vi.mock('@/http/tipo-coleta/use-list-tipo-coleta')
vi.mock('@/http/tipo-residuo/use-list-tipo-residuo')
vi.mock('@/hooks/use-role')

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoadingProvider>
          <RotasPage />
        </LoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('RotasPage', () => {
  it('should render a list of routes', async () => {
    vi.spyOn(usePaginatedRotas, 'usePaginatedRotas').mockReturnValue({
      data: {
        content: [
          { id: '1', nome: 'Rota Centro', tipoColetaId: 1, tipoResiduoId: 1, observacoes: 'Coleta diária', ativo: true },
          { id: '2', nome: 'Rota Bairros', tipoColetaId: 2, tipoResiduoId: 2, observacoes: 'Coleta semanal', ativo: false },
        ],
        totalPages: 1,
        totalElements: 2,
      },
      isLoading: false,
      isFetching: false,
    } as any)

    vi.spyOn(useListTipoColeta, 'useListTipoColeta').mockReturnValue({
      data: [
        { id: 1, nome: 'Hospitalar' },
        { id: 2, nome: 'Industrial' },
      ],
    } as any)

    vi.spyOn(useListTipoResiduo, 'useListTipoResiduo').mockReturnValue({
      data: [
        { id: 1, nome: 'Perigoso' },
        { id: 2, nome: 'Não Perigoso' },
      ],
    } as any)

    vi.spyOn(useRole, 'useRole').mockReturnValue({
      canEdit: () => true,
      canDelete: () => true,
      canCreate: () => true,
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Rota Centro')).toBeInTheDocument()
      expect(screen.getByText('Rota Bairros')).toBeInTheDocument()
    })

    expect(screen.getByText('Hospitalar')).toBeInTheDocument()
    expect(screen.getByText('Perigoso')).toBeInTheDocument()
    expect(screen.getByText('Coleta diária')).toBeInTheDocument()
    expect(screen.getByText('Ativa')).toBeInTheDocument()
    expect(screen.getByText('Inativa')).toBeInTheDocument()
  })
})
