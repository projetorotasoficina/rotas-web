/** biome-ignore-all lint/style/noMagicNumbers: números fictícios */
import { addDays } from 'date-fns'
import { AlertTriangle, FileText, Route } from 'lucide-react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { DateRangeFilter } from '@/components/dashboard/date-range-filter'
import { MetricCard } from '@/components/dashboard/metric-card'
import { QuickActions } from '@/components/dashboard/quick-actions'

const getMetricsByDateRange = (dateRange?: DateRange) => {
  if (!dateRange?.from) {
    return [
      {
        title: 'Rotas Ativas',
        value: 12,
        trend: {
          value: '+12.5%',
          type: 'positive' as const,
          description: 'Crescimento no período',
        },
        footerText: 'Período selecionado',
      },
      {
        title: 'Caminhões Operando',
        value: 8,
        trend: {
          value: '+2',
          type: 'positive' as const,
          description: 'Frota expandida',
        },
        footerText: 'Veículos em operação',
      },
      {
        title: 'Incidentes Pendentes',
        value: 3,
        trend: {
          value: '-20%',
          type: 'negative' as const,
          description: 'Redução significativa',
        },
        footerText: 'Requerem atenção',
      },
      {
        title: 'Motoristas Ativos',
        value: 25,
        trend: {
          value: '+18%',
          type: 'positive' as const,
          description: 'Equipe crescendo',
        },
        footerText: 'Profissionais disponíveis',
      },
    ]
  }

  const daysDiff = dateRange.to
    ? Math.abs(dateRange.to.getTime() - dateRange.from.getTime()) /
      (1000 * 60 * 60 * 24)
    : 1

  const multiplier = Math.max(0.5, Math.min(2, daysDiff / 30))

  return [
    {
      title: 'Rotas Ativas',
      value: Math.round(12 * multiplier),
      trend: {
        value: `+${(12.5 * multiplier).toFixed(1)}%`,
        type: 'positive' as const,
        description: 'Período personalizado',
      },
      footerText: `${Math.round(daysDiff)} dias selecionados`,
    },
    {
      title: 'Caminhões Operando',
      value: Math.round(8 * multiplier),
      trend: {
        value: `+${Math.round(2 * multiplier)}`,
        type: 'positive' as const,
        description: 'Frota no período',
      },
      footerText: 'Veículos em operação',
    },
    {
      title: 'Incidentes Pendentes',
      value: Math.round(3 * multiplier),
      trend: {
        value: '-15%',
        type: 'negative' as const,
        description: 'Redução no período',
      },
      footerText: 'Requerem atenção',
    },
    {
      title: 'Motoristas Ativos',
      value: Math.round(25 * multiplier),
      trend: {
        value: `+${(18 * multiplier).toFixed(1)}%`,
        type: 'positive' as const,
        description: 'Crescimento no período',
      },
      footerText: 'Profissionais disponíveis',
    },
  ]
}

const quickActions = [
  {
    title: 'Nova Rota',
    description: 'Programar coleta',
    icon: Route,
    href: '/operacoes/rotas',
  },
  {
    title: 'Relatório de Rotas',
    description: 'Gerar relatório de rotas',
    icon: FileText,
    href: '/documentos/relatorio-rotas',
  },
  {
    title: 'Relatório de Incidentes',
    description: 'Gerar relatório de incidentes',
    icon: AlertTriangle,
    href: '/documentos/relatorio-incidentes',
  },
]

export function HomePage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const metrics = getMetricsByDateRange(dateRange)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Dashboard</h2>
        <DateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard
            footerText={metric.footerText}
            key={metric.title}
            title={metric.title}
            trend={metric.trend}
            value={metric.value}
          />
        ))}
      </div>

      <QuickActions actions={quickActions} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border-2 border-muted-foreground/25 border-dashed p-8 text-center">
          <h3 className="font-medium text-lg text-muted-foreground">
            Gráfico de Coletas
          </h3>
          <p className="mt-2 text-muted-foreground text-sm">
            Em desenvolvimento...
          </p>
        </div>
        <div className="rounded-lg border-2 border-muted-foreground/25 border-dashed p-8 text-center">
          <h3 className="font-medium text-lg text-muted-foreground">
            Próximas Rotas
          </h3>
          <p className="mt-2 text-muted-foreground text-sm">
            Em desenvolvimento...
          </p>
        </div>
      </div>
    </div>
  )
}
