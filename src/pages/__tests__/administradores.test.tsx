/** biome-ignore-all lint/performance/noNamespaceImport: não necessário para testes */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/contexts/auth-context'
import { LoadingProvider } from '@/contexts/loading-context'
import * as usePaginatedUsuarios from '@/http/usuarios/use-paginated-usuarios'
import AdministradoresPage from '../administradores'

const queryClient = new QueryClient()

vi.mock('@/http/usuarios/use-paginated-usuarios')

const renderComponent = () => {
  // Mock para o localStorage, já que o AuthProvider o utiliza
  const storage: Record<string, string> = {}
  vi.spyOn(window.localStorage, 'getItem').mockImplementation(
    (key: string) => storage[key] ?? null
  )
  vi.spyOn(window.localStorage, 'setItem').mockImplementation(
    (key: string, value: string) => {
      storage[key] = value
    }
  )

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoadingProvider>
          <AdministradoresPage />
        </LoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('AdministradoresPage', () => {
  it('should render a list of administrators', async () => {
    vi.spyOn(usePaginatedUsuarios, 'usePaginatedUsuarios').mockReturnValue({
      data: {
        content: [
          {
            id: '1',
            nome: 'Admin Teste 1',
            email: 'admin1@test.com',
            cpf: '111.111.111-11',
            telefone: '11987654321',
            roles: ['ROLE_ADMIN_CONSULTA'],
            ativo: true,
          },
          {
            id: '2',
            nome: 'Admin Teste 2',
            email: 'admin2@test.com',
            cpf: '222.222.222-22',
            telefone: '22987654321',
            roles: ['ROLE_SUPER_ADMIN'],
            ativo: false,
          },
        ],
        totalPages: 1,
        totalElements: 2,
      },
      isLoading: false,
      isFetching: false,
    } as any)

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Admin Teste 1')).toBeInTheDocument()
      expect(screen.getByText('Admin Teste 2')).toBeInTheDocument()
    })

    expect(screen.getByText('admin1@test.com')).toBeInTheDocument()
    expect(screen.getByText('111.111.111-11')).toBeInTheDocument()
    expect(screen.getByText('Admin Consulta')).toBeInTheDocument() // Corrigido
    expect(screen.getByText('Super Admin')).toBeInTheDocument() // ROLE_SUPER_ADMIN
    expect(screen.getByText('Ativo')).toBeInTheDocument()
    expect(screen.getByText('Inativo')).toBeInTheDocument()
  })
})
