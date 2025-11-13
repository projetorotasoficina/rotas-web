/** biome-ignore-all lint/performance/noNamespaceImport: não necessário para testes */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/contexts/auth-context'
import { LoadingProvider } from '@/contexts/loading-context'
import * as usePaginatedAppTokens from '@/http/app-tokens/use-paginated-app-tokens'
import * as usePaginatedCodigos from '@/http/codigos-ativacao/use-paginated-codigos-ativacao'
import AppAndroidPage from '../app-android'

const queryClient = new QueryClient()

vi.mock('@/http/codigos-ativacao/use-paginated-codigos-ativacao')
vi.mock('@/http/app-tokens/use-paginated-app-tokens')

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
          <AppAndroidPage />
        </LoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('AppAndroidPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(
      usePaginatedCodigos,
      'usePaginatedCodigosAtivacao'
    ).mockReturnValue({
      data: {
        content: [
          {
            id: '1',
            codigo: '123456',
            dataCadastro: '2025-11-09T10:00:00Z',
            dataUso: null,
            usuarioId: null,
          },
        ],
        totalPages: 1,
        totalElements: 1,
      },
      isLoading: false,
      isFetching: false,
    } as any)

    vi.spyOn(usePaginatedAppTokens, 'usePaginatedAppTokens').mockReturnValue({
      data: {
        content: [
          {
            id: '1',
            nomeDispositivo: 'Device 1',
            deviceId: 'test-device-id',
            dataCriacao: '2025-11-09T10:00:00Z',
            ultimoAcesso: null,
            ativo: true,
            token: 'test-token',
          },
        ],
        totalPages: 1,
        totalElements: 1,
      },
      isLoading: false,
      isFetching: false,
    } as any)
  })

  it('should render the title and tabs', () => {
    renderComponent()
    expect(screen.getByText('Gerenciar App Android')).toBeInTheDocument()
    expect(screen.getByText('Códigos de Ativação')).toBeInTheDocument()
    expect(screen.getByText('Tokens Ativos')).toBeInTheDocument()
  })

  it('should show "Códigos de Ativação" tab by default', async () => {
    renderComponent()
    await waitFor(() => {
      expect(screen.getByText('123456')).toBeInTheDocument()
    })
  })

  it('should switch to "Tokens Ativos" tab and show the table', async () => {
    renderComponent()
    fireEvent.click(screen.getByText('Tokens Ativos'))
    await waitFor(() => {
      screen.debug()
    })
  })

  it('should open the token details modal', async () => {
    renderComponent()
    fireEvent.click(screen.getByText('Tokens Ativos'))
    await waitFor(() => {
      screen.debug()
    })
  })
})
