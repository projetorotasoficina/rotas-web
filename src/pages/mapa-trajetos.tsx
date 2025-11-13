import { addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  Route,
  Truck,
  User,
} from 'lucide-react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { DateRangeFilter } from '@/components/dashboard/date-range-filter'
import { RouteInfo } from '@/components/dashboard/route-info'
import { RouteMap } from '@/components/dashboard/route-map'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useListCaminhoes } from '@/http/caminhoes/use-list-caminhoes'
import { useListMotoristas } from '@/http/motoristas/use-list-motoristas'
import type { Incidente, Trajeto, TrajetoStatus } from '@/http/trajeto/types'
import { useGetTrajetoPontos } from '@/http/trajeto/use-get-trajeto-pontos'
import { useListTrajetos } from '@/http/trajeto/use-list-trajetos'
import { formatDuracao } from '@/lib/utils'
import { apiConfig, fetchWithAuth } from '@/services/api'

const STATUS_CONFIG: Record<
  TrajetoStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  EM_ANDAMENTO: { label: 'Em Andamento', variant: 'default' },
  FINALIZADO: { label: 'Finalizado', variant: 'secondary' },
  CANCELADO: { label: 'Cancelado', variant: 'destructive' },
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Complex page component with multiple conditional renders
export default function MapaTrajetosPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  })
  const [selectedMotoristaId, setSelectedMotoristaId] = useState<string>('all')
  const [selectedCaminhaoId, setSelectedCaminhaoId] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedTrajetoId, setSelectedTrajetoId] = useState<number | null>(
    null
  )

  const { data: trajetos = [], isLoading: isLoadingTrajetos } =
    useListTrajetos()
  const { data: motoristas = [] } = useListMotoristas()
  const { data: caminhoes = [] } = useListCaminhoes()

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Filter function with multiple conditional checks
  const trajetosFiltrados = trajetos.filter((trajeto: Trajeto) => {
    if (dateRange?.from && dateRange?.to) {
      const trajetoData = new Date(trajeto.dataInicio)
      if (trajetoData < dateRange.from || trajetoData > dateRange.to) {
        return false
      }
    }
    if (
      selectedMotoristaId !== 'all' &&
      trajeto.motoristaId !== Number(selectedMotoristaId)
    ) {
      return false
    }
    if (
      selectedCaminhaoId !== 'all' &&
      trajeto.caminhaoId !== Number(selectedCaminhaoId)
    ) {
      return false
    }
    if (selectedStatus !== 'all' && trajeto.status !== selectedStatus) {
      return false
    }
    return true
  })

  const selectedTrajeto = trajetosFiltrados.find(
    (t: Trajeto) => t.id === selectedTrajetoId
  )

  const { data: pontos = [], isLoading: isLoadingPontos } = useGetTrajetoPontos(
    selectedTrajetoId ?? 0,
    {
      enabled: !!selectedTrajetoId,
    }
  )

  const [incidentes, setIncidentes] = useState<Incidente[]>([])
  const [isLoadingIncidentes, setIsLoadingIncidentes] = useState(false)

  const loadIncidentes = async (trajetoId: number) => {
    setIsLoadingIncidentes(true)
    try {
      const response = await fetchWithAuth(
        apiConfig.endpoints.trajetos.incidentes(trajetoId)
      )
      const data = await response.json()
      setIncidentes(data)
    } catch {
      setIncidentes([])
    } finally {
      setIsLoadingIncidentes(false)
    }
  }

  const handleTrajetoSelect = (trajetoId: number) => {
    setSelectedTrajetoId(trajetoId)
    loadIncidentes(trajetoId)
  }

  const trajetoComPontos =
    selectedTrajeto && pontos.length > 0
      ? { ...selectedTrajeto, pontos, incidentes }
      : null

  const trajetoParaDetalhes = selectedTrajeto
    ? { ...selectedTrajeto, pontos, incidentes }
    : null

  const getDuracao = (trajeto: Trajeto) => {
    if (!trajeto.dataFim) {
      return null
    }
    const inicio = new Date(trajeto.dataInicio).getTime()
    const fim = new Date(trajeto.dataFim).getTime()
    const duracaoMs = fim - inicio
    return formatDuracao(duracaoMs)
  }

  return (
    <div className="flex h-full flex-col gap-4 pb-4 lg:h-[calc(100vh-7rem)] lg:gap-4 lg:pb-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-bold text-xl tracking-tight sm:text-2xl">
            Mapa de Trajetos
          </h1>
          <p className="text-muted-foreground text-sm">
            Visualize e analise os trajetos das rotas de coleta
          </p>
        </div>
      </div>

      <Card className="py-1">
        <CardContent className="px-4 py-3">
          <div className="flex flex-col gap-1 lg:flex-row lg:flex-wrap lg:items-center">
            <DateRangeFilter
              className="w-full lg:w-auto"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />

            <Separator className="hidden h-8 lg:block" orientation="vertical" />

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <Select
                onValueChange={setSelectedMotoristaId}
                value={selectedMotoristaId}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Motorista" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos motoristas</SelectItem>
                  {motoristas.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={setSelectedCaminhaoId}
                value={selectedCaminhaoId}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Caminhão" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos caminhões</SelectItem>
                  {caminhoes.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.placa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos status</SelectItem>
                  <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                  <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden lg:grid lg:grid-cols-[360px_1fr_380px]">
        <Card className="flex max-h-[350px] flex-col overflow-hidden lg:max-h-none">
          <CardHeader className="flex-shrink-0 border-b px-3 sm:px-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Trajetos</h3>
              <Badge className="lg:inline-flex" variant="outline">
                {trajetosFiltrados.length} encontrado
                {trajetosFiltrados.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>

          <div className="flex-1 overflow-y-auto p-2 sm:p-3">
            {isLoadingTrajetos && (
              <div className="flex h-60 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-muted-foreground text-sm">
                    Carregando trajetos...
                  </p>
                </div>
              </div>
            )}

            {!isLoadingTrajetos && trajetosFiltrados.length === 0 && (
              <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Route className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 font-semibold text-sm">
                  Nenhum trajeto encontrado
                </h3>
                <p className="text-muted-foreground text-xs">
                  Ajuste os filtros para visualizar trajetos
                </p>
              </div>
            )}

            {!isLoadingTrajetos &&
              trajetosFiltrados.map((trajeto: Trajeto) => {
                const motorista = motoristas.find(
                  (m) => m.id === trajeto.motoristaId
                )
                const caminhao = caminhoes.find(
                  (c) => c.id === trajeto.caminhaoId
                )
                const isSelected = selectedTrajetoId === trajeto.id
                const duracao = getDuracao(trajeto)

                return (
                  <button
                    className={`group mb-2 w-full rounded-lg border p-2.5 text-left transition-all hover:shadow-md sm:p-3 ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'hover:border-primary/50 hover:bg-accent/50'
                    }`}
                    key={trajeto.id}
                    onClick={() => handleTrajetoSelect(trajeto.id)}
                    type="button"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-1.5 sm:gap-2">
                          <User className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground sm:h-4 sm:w-4" />
                          <p className="truncate font-semibold text-xs sm:text-sm">
                            {motorista?.nome || 'Sem motorista'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Truck className="h-3 w-3 flex-shrink-0 text-muted-foreground sm:h-3.5 sm:w-3.5" />
                          <p className="truncate text-muted-foreground text-xs">
                            {caminhao?.placa || 'Sem placa'}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className="flex-shrink-0 text-[10px] sm:text-xs"
                        variant={STATUS_CONFIG[trajeto.status].variant}
                      >
                        {STATUS_CONFIG[trajeto.status].label}
                      </Badge>
                    </div>

                    <Separator className="mb-2 sm:mb-3" />

                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center gap-1.5 text-xs sm:gap-2">
                        <Calendar className="h-3 w-3 flex-shrink-0 text-muted-foreground sm:h-3.5 sm:w-3.5" />
                        <span className="truncate text-muted-foreground">
                          {format(new Date(trajeto.dataInicio), 'PPP', {
                            locale: ptBR,
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs sm:gap-2">
                        <Clock className="h-3 w-3 flex-shrink-0 text-muted-foreground sm:h-3.5 sm:w-3.5" />
                        <span className="text-muted-foreground">
                          {format(new Date(trajeto.dataInicio), 'HH:mm', {
                            locale: ptBR,
                          })}
                          {trajeto.dataFim && (
                            <>
                              {' → '}
                              {format(new Date(trajeto.dataFim), 'HH:mm', {
                                locale: ptBR,
                              })}
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:flex-col sm:items-start sm:gap-y-2">
                        {trajeto.distanciaTotal && (
                          <div className="flex items-center gap-1.5 text-xs sm:gap-2">
                            <MapPin className="h-3 w-3 flex-shrink-0 text-muted-foreground sm:h-3.5 sm:w-3.5" />
                            <span className="text-muted-foreground">
                              {(trajeto.distanciaTotal / 1000).toFixed(2)} km
                            </span>
                          </div>
                        )}

                        {duracao && (
                          <div className="flex items-center gap-1.5 text-xs sm:gap-2">
                            <Clock className="h-3 w-3 flex-shrink-0 text-muted-foreground sm:h-3.5 sm:w-3.5" />
                            <span className="text-muted-foreground">
                              {duracao}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-2 flex items-center gap-1 text-primary text-xs sm:mt-3">
                        <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="font-medium">
                          Visualizando no mapa
                        </span>
                      </div>
                    )}
                  </button>
                )
              })}
          </div>
        </Card>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden lg:contents">
          <div className="flex flex-1 overflow-hidden">
            {!selectedTrajetoId && (
              <Card className="flex h-full w-full items-center justify-center">
                <div className="px-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 sm:h-20 sm:w-20">
                    <MapPin className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
                  </div>
                  <h3 className="mb-2 font-semibold text-base sm:text-lg">
                    Selecione um trajeto
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Escolha um trajeto da lista{' '}
                    <span className="hidden lg:inline">lateral </span>para
                    visualizar o percurso no mapa
                  </p>
                </div>
              </Card>
            )}

            {selectedTrajetoId && (isLoadingPontos || isLoadingIncidentes) && (
              <Card className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent sm:h-10 sm:w-10" />
                  <p className="font-medium text-sm">Carregando trajeto...</p>
                  <p className="text-muted-foreground text-xs">
                    Obtendo pontos e incidentes
                  </p>
                </div>
              </Card>
            )}

            {selectedTrajetoId &&
              !isLoadingPontos &&
              !isLoadingIncidentes &&
              trajetoComPontos && (
                <div className="h-full w-full">
                  <RouteMap trajeto={trajetoComPontos} />
                </div>
              )}

            {selectedTrajetoId &&
              !isLoadingPontos &&
              !isLoadingIncidentes &&
              !trajetoComPontos && (
                <Card className="flex h-full w-full items-center justify-center">
                  <div className="px-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted sm:h-20 sm:w-20">
                      <Route className="h-8 w-8 text-muted-foreground sm:h-10 sm:w-10" />
                    </div>
                    <h3 className="mb-2 font-semibold text-base sm:text-lg">
                      Sem dados
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Este trajeto não possui pontos GPS registrados
                    </p>
                  </div>
                </Card>
              )}
          </div>

          <div className="hidden lg:block lg:overflow-y-auto">
            {!selectedTrajetoId && (
              <Card className="flex h-full w-full items-center justify-center">
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Route className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 font-semibold text-base">
                    Detalhes do Trajeto
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Selecione um trajeto para visualizar os detalhes
                  </p>
                </div>
              </Card>
            )}

            {selectedTrajetoId && (isLoadingPontos || isLoadingIncidentes) && (
              <Card className="flex h-full w-full items-center justify-center">
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="font-medium text-sm">Carregando...</p>
                </div>
              </Card>
            )}

            {selectedTrajetoId &&
              !isLoadingPontos &&
              !isLoadingIncidentes &&
              trajetoParaDetalhes && (
                <RouteInfo trajeto={trajetoParaDetalhes} />
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
