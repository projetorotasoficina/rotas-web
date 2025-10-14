/** biome-ignore-all lint/style/noMagicNumbers: não necessário */
import { differenceInMinutes, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertTriangle, Calendar, Clock, Navigation } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { TrajetoComPontos } from '@/http/trajeto/types'
import { formatDuracao } from '@/lib/utils'

type RouteInfoProps = {
  trajeto: TrajetoComPontos
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'FINALIZADO':
      return 'Finalizado'
    case 'EM_ANDAMENTO':
      return 'Em Andamento'
    case 'CANCELADO':
      return 'Cancelado'
    default:
      return status
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'FINALIZADO':
      return 'default' as const
    case 'EM_ANDAMENTO':
      return 'secondary' as const
    case 'CANCELADO':
      return 'destructive' as const
    default:
      return 'default' as const
  }
}

export function RouteInfo({ trajeto }: RouteInfoProps) {
  const { dataInicio, dataFim, distanciaTotal, status, pontos, incidentes } =
    trajeto

  const duracao = dataFim
    ? differenceInMinutes(new Date(dataFim), new Date(dataInicio))
    : 0

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Última Rota</h3>
          <Badge variant={getStatusVariant(status)}>
            {getStatusLabel(status)}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground text-xs">Duração</p>
              </div>
              <p className="font-semibold text-lg">
                {duracao > 0 ? formatDuracao(duracao) : '-'}
              </p>
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground text-xs">Distância</p>
              </div>
              <p className="font-semibold text-lg">
                {distanciaTotal
                  ? `${(distanciaTotal / 1000).toFixed(1)} km`
                  : '-'}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="mb-1 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-muted-foreground text-xs">Período</p>
            </div>
            <p className="text-sm">
              {format(new Date(dataInicio), "dd/MM 'às' HH:mm", {
                locale: ptBR,
              })}
              {dataFim && (
                <>
                  {' → '}
                  {format(new Date(dataFim), "dd/MM 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </>
              )}
            </p>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="font-bold text-2xl">{pontos?.length || 0}</p>
                <p className="text-muted-foreground text-xs">Pontos</p>
              </div>
              <div>
                <p className="font-bold text-2xl">{incidentes?.length || 0}</p>
                <p className="text-muted-foreground text-xs">Incidentes</p>
              </div>
            </div>
          </div>

          {incidentes && incidentes.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/20">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                <p className="text-sm">
                  {incidentes.length} incidente
                  {incidentes.length > 1 ? 's' : ''} registrado
                  {incidentes.length > 1 ? 's' : ''} nesta rota
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
