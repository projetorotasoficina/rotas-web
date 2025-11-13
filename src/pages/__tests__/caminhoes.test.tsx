/** biome-ignore-all lint/performance/noNamespaceImport: não necessário para testes */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/contexts/auth-context'
import { LoadingProvider } from '@/contexts/loading-context'
import * as useRole from '@/hooks/use-role'
import * as usePaginatedCaminhoes from '@/http/caminhoes/use-paginated-caminhoes'
import * as useListTipoColeta from '@/http/tipo-coleta/use-list-tipo-coleta'
import * as useListTipoResiduo from '@/http/tipo-residuo/use-list-tipo-residuo'
import CaminhoesPage from '../caminhoes'

const queryClient = new QueryClient()

vi.mock('@/http/caminhoes/use-paginated-caminhoes')
vi.mock('@/http/tipo-coleta/use-list-tipo-coleta')
vi.mock('@/http/tipo-residuo/use-list-tipo-residuo')
vi.mock('@/hooks/use-role')

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoadingProvider>
          <CaminhoesPage />
        </LoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('CaminhoesPage', () => {
  it('should render a list of trucks', async () => {
    vi.spyOn(usePaginatedCaminhoes, 'usePaginatedCaminhoes').mockReturnValue({
      data: {
        content: [
          {
            id: '1',
            modelo: 'Volvo VM 260',
            placa: 'ABC-1234',
            tipoColetaId: 1,
            residuoId: 1,
            tipoVeiculo: 'CAMINHAO_MEDIO',
            ativo: true,
          },
          {
            id: '2',
            modelo: 'Scania R450',
            placa: 'DEF-5678',
            tipoColetaId: 2,
            residuoId: 2,
            tipoVeiculo: 'CAMINHAO_CARRETA',
            ativo: false,
          },
        ],
        totalPages: 1,
        totalElements: 2,
      },
      isLoading: false,
      isFetching: false,
    } as any)

    vi.spyOn(useListTipoColeta, 'useListTipoColeta').mockReturnValue({
      data: [
        { id: 1, nome: 'Seletiva' },
        { id: 2, nome: 'Orgânica' },
      ],
    } as any)

    vi.spyOn(useListTipoResiduo, 'useListTipoResiduo').mockReturnValue({
      data: [
        { id: 1, nome: 'Reciclável' },
        { id: 2, nome: 'Comum' },
      ],
    } as any)

    vi.spyOn(useRole, 'useRole').mockReturnValue({
      hasRole: () => true,
      hasAnyRole: () => true,
      hasAllRoles: () => true,
      isSuperAdmin: () => true,
      isAdminConsulta: () => true,
      canWrite: () => true,
      canEdit: () => true,
      canDelete: () => true,
      canCreate: () => true,
      userRoles: ['ROLE_SUPER_ADMIN'],
    })

    renderComponent()

    expect((await screen.findAllByText('Volvo VM 260'))[0]).toBeInTheDocument()
    expect((await screen.findAllByText('Scania R450'))[0]).toBeInTheDocument()
    expect((await screen.findAllByText('ABC-1234'))[0]).toBeInTheDocument()
    expect((await screen.findAllByText('Seletiva'))[0]).toBeInTheDocument()
    expect((await screen.findAllByText('Reciclável'))[0]).toBeInTheDocument()
    expect((await screen.findAllByText('Ativo'))[0]).toBeInTheDocument()
    expect((await screen.findAllByText('Inativo'))[0]).toBeInTheDocument()
  })
})
