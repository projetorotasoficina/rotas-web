import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/contexts/auth-context'
import { LoadingProvider } from '@/contexts/loading-context'
import * as usePaginatedMotoristas from '@/http/motoristas/use-paginated-motoristas'
import * as useRole from '@/hooks/use-role'
import { MotoristasPage } from './motoristas'

const queryClient = new QueryClient()

vi.mock('@/http/motoristas/use-paginated-motoristas')
vi.mock('@/hooks/use-role')

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoadingProvider>
          <MotoristasPage />
        </LoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('MotoristasPage', () => {
  it('should render a list of drivers', async () => {
    vi.spyOn(usePaginatedMotoristas, 'usePaginatedMotoristas').mockReturnValue({
      data: {
        content: [
          { id: '1', nome: 'Motorista Teste 1', cpf: '111.111.111-11', telefone: '11987654321', ativo: true, cnhCategoria: 'A', cnhValidade: '2028-01-01T00:00:00Z' },
          { id: '2', nome: 'Motorista Teste 2', cpf: '222.222.222-22', telefone: '22987654321', ativo: false, cnhCategoria: 'B', cnhValidade: '2027-06-15T00:00:00Z' },
        ],
        totalPages: 1,
        totalElements: 2,
      },
      isLoading: false,
      isFetching: false,
    } as any)

    vi.spyOn(useRole, 'useRole').mockReturnValue({
      canEdit: () => true,
      canDelete: () => true,
      canCreate: () => true,
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Motorista Teste 1')).toBeInTheDocument()
      expect(screen.getByText('Motorista Teste 2')).toBeInTheDocument()
    })

    expect(screen.getByText('111.111.111-11')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('01/01/2028')).toBeInTheDocument()
    expect(screen.getByText('Ativo')).toBeInTheDocument()
    expect(screen.getByText('Inativo')).toBeInTheDocument()
  })
})
