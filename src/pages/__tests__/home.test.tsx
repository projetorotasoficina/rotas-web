/** biome-ignore-all lint/performance/noNamespaceImport: não necessário para testes */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/contexts/auth-context'
import { LoadingProvider } from '@/contexts/loading-context'
import * as useTrajetosStats from '@/http/trajeto/use-trajetos-stats'
import * as useUltimoTrajeto from '@/http/trajeto/use-ultimo-trajeto'
import HomePage from '../home'

const queryClient = new QueryClient()

vi.mock('@/http/trajeto/use-trajetos-stats')
vi.mock('@/http/trajeto/use-ultimo-trajeto')

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
          <HomePage />
        </LoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render dashboard title and date range filter', () => {
    // Set a fixed date for this specific test
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-11-10T12:00:00Z'))

    vi.spyOn(useTrajetosStats, 'useTrajetosStats').mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
    } as any)
    vi.spyOn(useUltimoTrajeto, 'useUltimoTrajeto').mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
    } as any)

    renderComponent()

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(
      screen.getByText('Visão geral das operações de coleta')
    ).toBeInTheDocument()
    // The default range is 30 days prior to the mocked date.
    // from: 2025-10-11, to: 2025-11-10
    // The format is dd/MM/yyyy
    expect(
      screen.getByRole('button', { name: '11/10/2025 - 10/11/2025' })
    ).toBeInTheDocument()

    // Restore real timers
    vi.useRealTimers()
  })

  it('should render metric cards with data', async () => {
    vi.spyOn(useTrajetosStats, 'useTrajetosStats').mockReturnValue({
      data: {
        totalFinalizados: 10,
        emAndamento: 2,
        distanciaTotal: 150.5,
        duracaoMedia: 60, // 60 minutes = 1 hour
      },
      isLoading: false,
      isFetching: false,
    } as any)
    vi.spyOn(useUltimoTrajeto, 'useUltimoTrajeto').mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
    } as any)

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Trajetos Finalizados')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('Trajetos em Andamento')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('Distância Total')).toBeInTheDocument()
      expect(screen.getByText('150.5 km')).toBeInTheDocument()
      expect(screen.getByText('Duração Média')).toBeInTheDocument()
      expect(screen.getByText('1h 0min')).toBeInTheDocument()
    })
  })

  it('should render "Nenhuma rota finalizada" when no ultimoTrajeto data', async () => {
    vi.spyOn(useTrajetosStats, 'useTrajetosStats').mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
    } as any)
    vi.spyOn(useUltimoTrajeto, 'useUltimoTrajeto').mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
    } as any)

    renderComponent()

    await waitFor(() => {
      expect(screen.getAllByText('Nenhuma rota finalizada').length).toBe(2)
      expect(
        screen.getAllByText('Aguardando primeiro trajeto concluído').length
      ).toBe(2)
    })
  })

  it('should render RouteMap and RouteInfo when ultimoTrajeto data is available', async () => {
    vi.spyOn(useTrajetosStats, 'useTrajetosStats').mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
    } as any)
    vi.spyOn(useUltimoTrajeto, 'useUltimoTrajeto').mockReturnValue({
      data: {
        id: '1',
        nome: 'Rota Teste',
        status: 'FINALIZADO',
        distanciaTotal: 10_500, // in meters
        duracao: 20, // in minutes
        pontos: [
          { latitude: 0, longitude: 0, horario: '2025-11-09T10:00:00Z' },
        ],
        dataInicio: '2025-11-09T10:00:00Z',
        dataFim: '2025-11-09T10:20:00Z',
      },
      isLoading: false,
      isFetching: false,
    } as any)

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Última Rota')).toBeInTheDocument()
      expect(screen.getByText('Finalizado')).toBeInTheDocument()
      expect(screen.getByText('10.5 km')).toBeInTheDocument()
      expect(screen.getByText('20min')).toBeInTheDocument()
    })
  })

  it('should show loading indicators when data is loading', () => {
    vi.spyOn(useTrajetosStats, 'useTrajetosStats').mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
    } as any)
    vi.spyOn(useUltimoTrajeto, 'useUltimoTrajeto').mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
    } as any)

    renderComponent()

    // Check for loading spinners
    expect(screen.getAllByTestId('loading-spinner').length).toBeGreaterThan(0)
  })
})
