/**
 * @file Página do Dashboard (Home).
 * @description Este arquivo define o componente `HomePage`, que serve como o painel principal
 * da aplicação. O dashboard exibe uma visão geral das operações de coleta, incluindo:
 *
 * - **Métricas Principais**: Cards com estatísticas como trajetos finalizados, distância
 *   percorrida, etc. Os dados são baseados em um período selecionável.
 * - **Filtro de Período**: Um seletor de data (`DateRangeFilter`) que permite ao usuário
 *   definir o período para as estatísticas exibidas.
 * - **Mapa do Último Trajeto**: Um mapa (`RouteMap`) que exibe o percurso do último
 *   trajeto finalizado, mostrando o caminho percorrido.
 * - **Informações do Último Trajeto**: Detalhes (`RouteInfo`) sobre o último trajeto,
 *   como motorista, caminhão, duração e distância.
 *
 * O componente gerencia o estado do filtro de data e utiliza hooks customizados
 * (`useTrajetosStats`, `useUltimoTrajeto`) para buscar os dados da API de forma reativa.
 */
import { addDays } from 'date-fns'
import { useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { DateRangeFilter } from '@/components/dashboard/date-range-filter'
import { MetricCard } from '@/components/dashboard/metric-card'
import { RouteInfo } from '@/components/dashboard/route-info'
import { RouteMap } from '@/components/dashboard/route-map'
import { useTrajetosStats } from '@/http/trajeto/use-trajetos-stats'
import { useUltimoTrajeto } from '@/http/trajeto/use-ultimo-trajeto'
import { formatDuracao } from '@/lib/utils'

/**
 * @description Componente que renderiza a página principal do dashboard.
 */
export function HomePage() {
  // Estado para controlar o período de data selecionado para as estatísticas.
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30), // Padrão: últimos 30 dias.
    to: new Date(),
  })

  // Hook para buscar os dados do último trajeto finalizado.
  const { data: ultimoTrajeto, isLoading: isLoadingTrajeto } =
    useUltimoTrajeto()
  // Hook para buscar as estatísticas dos trajetos com base no período selecionado.
  const { data: stats, isLoading: isLoadingStats } = useTrajetosStats(
    dateRange?.from,
    dateRange?.to
  )

  // Memoiza as métricas para evitar recálculos desnecessários a cada renderização.
  const metrics = useMemo(
    () => [
      {
        title: 'Trajetos Finalizados',
        value: stats?.totalFinalizados || 0,
        footerText: 'No período selecionado',
      },
      {
        title: 'Trajetos em Andamento',
        value: stats?.emAndamento || 0,
        footerText: 'Atualmente em execução',
      },
      {
        title: 'Distância Total',
        value: stats?.distanciaTotal
          ? `${stats.distanciaTotal.toFixed(1)} km`
          : '0 km',
        footerText: 'Percorrida no período',
      },
      {
        title: 'Duração Média',
        value: stats?.duracaoMedia ? formatDuracao(stats.duracaoMedia) : '0min',
        footerText: 'Por trajeto finalizado',
      },
    ],
    [stats]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Visão geral das operações de coleta
          </p>
        </div>
        <DateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      {/* Seção de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoadingStats
          ? // Exibe skeletons de carregamento enquanto as estatísticas são buscadas.
            [
              'trajetos-finalizados',
              'em-andamento',
              'distancia',
              'duracao',
            ].map((key) => (
              <div
                className="flex h-32 items-center justify-center rounded-lg border"
                key={key}
              >
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ))
          : metrics.map((metric) => (
              <MetricCard
                footerText={metric.footerText}
                key={metric.title}
                title={metric.title}
                value={metric.value}
              />
            ))}
      </div>

      {/* Seção do Mapa e Informações do Trajeto */}
      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          {isLoadingTrajeto && (
            <div className="flex h-[500px] items-center justify-center rounded-lg border">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {!isLoadingTrajeto && ultimoTrajeto && (
            <RouteMap trajeto={ultimoTrajeto} />
          )}

          {/* Mensagem exibida se não houver último trajeto e não estiver carregando. */}
          {!(isLoadingTrajeto || ultimoTrajeto) && (
            <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed">
              <div className="text-center">
                <h3 className="font-medium text-lg text-muted-foreground">
                  Nenhuma rota finalizada
                </h3>
                <p className="mt-2 text-muted-foreground text-sm">
                  Aguardando primeiro trajeto concluído
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {isLoadingTrajeto && (
            <div className="flex h-full items-center justify-center rounded-lg border">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {!isLoadingTrajeto && ultimoTrajeto && (
            <RouteInfo trajeto={ultimoTrajeto} />
          )}

          {/* Mensagem exibida se não houver último trajeto e não estiver carregando. */}
          {!(isLoadingTrajeto || ultimoTrajeto) && (
            <div className="rounded-lg border-2 border-muted-foreground/25 border-dashed p-8 text-center">
              <h3 className="font-medium text-lg text-muted-foreground">
                Nenhuma rota finalizada
              </h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Aguardando primeiro trajeto concluído
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
