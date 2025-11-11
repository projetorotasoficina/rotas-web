import { Calendar, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import type { Rota } from '@/http/rotas/types'
import type { TipoResiduo as TipoResiduoType } from '@/http/tipo-residuo/types'
import type { Trajeto } from '@/http/trajeto/types'

type FilterSidebarProps = {
  tipoResiduoId: number | null
  trajetoId: number | null
  rotaId: number | null
  tiposResiduo: TipoResiduoType[]
  trajetos: Trajeto[]
  rotas: Rota[]
  rotasFiltradas: Rota[]
  isLoadingTipos: boolean
  isLoadingTrajetos: boolean
  onTipoResiduoChange: (value: number | null) => void
  onTrajetoChange: (value: number | null) => void
  onRotaChange: (value: number | null) => void
}

export function FilterSidebar({
  tipoResiduoId,
  trajetoId,
  rotaId,
  tiposResiduo,
  trajetos,
  rotas,
  rotasFiltradas,
  isLoadingTipos,
  isLoadingTrajetos,
  onTipoResiduoChange,
  onTrajetoChange,
  onRotaChange,
}: FilterSidebarProps) {
  // Período de filtro de trajetos (em dias)
  const [periodoDias, setPeriodoDias] = useState<number>(7)

  // Resetar rota quando o tipo de resíduo mudar
  useEffect(() => {
    if (rotaId && tipoResiduoId) {
      // Verificar se a rota atual pertence ao tipo de resíduo selecionado
      const rotaAtual = rotas.find((r) => r.id === rotaId)
      if (rotaAtual && rotaAtual.tipoResiduoId !== tipoResiduoId) {
        onRotaChange(null)
        onTrajetoChange(null)
      }
    }
  }, [tipoResiduoId, rotaId, rotas, onRotaChange, onTrajetoChange])

  // Resetar trajeto selecionado quando a rota mudar
  useEffect(() => {
    if (rotaId && trajetoId) {
      // Verificar se o trajeto atual pertence à rota selecionada
      const trajetoAtual = trajetos.find((t) => t.id === trajetoId)
      if (trajetoAtual && trajetoAtual.rotaId !== rotaId) {
        onTrajetoChange(null)
      }
    }
  }, [rotaId, trajetoId, trajetos, onTrajetoChange])

  // Rotas filtradas apenas por tipo de resíduo (para dropdown)
  const rotasDisponiveis = rotas.filter(
    (rota) =>
      rota.ativo &&
      rota.areaGeografica &&
      (!tipoResiduoId || rota.tipoResiduoId === tipoResiduoId)
  )

  // Filtrar trajetos por tipo de resíduo, rota específica, status e período
  const trajetosFiltrados = trajetos.filter((t) => {
    const rota = rotas.find((r) => r.id === t.rotaId)

    // Verificar se é finalizado e do tipo de resíduo correto
    if (t.status !== 'FINALIZADO' || rota?.tipoResiduoId !== tipoResiduoId) {
      return false
    }

    // Se uma rota específica foi selecionada, filtrar por ela
    if (rotaId && t.rotaId !== rotaId) {
      return false
    }

    // Filtrar por data (últimos X dias)
    const dataInicio = new Date(t.dataInicio)
    const hoje = new Date()
    const diasAtras = new Date(hoje)
    diasAtras.setDate(hoje.getDate() - periodoDias)

    return dataInicio >= diasAtras
  })

  return (
    <Card className="flex max-h-[500px] flex-col overflow-hidden lg:max-h-none">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Filtros
        </CardTitle>
        <CardDescription>Configure a visualização do mapa</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 overflow-y-auto">
        <div className="space-y-2">
          <Label htmlFor="tipo-residuo">
            Tipo de Resíduo <span className="text-destructive">*</span>
          </Label>
          {isLoadingTipos ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              onValueChange={(value) => {
                onTipoResiduoChange(value ? Number(value) : null)
                onTrajetoChange(null) // Resetar trajeto ao mudar tipo
              }}
              value={tipoResiduoId?.toString() || ''}
            >
              <SelectTrigger id="tipo-residuo">
                <SelectValue placeholder="Selecione um tipo de resíduo" />
              </SelectTrigger>
              <SelectContent>
                {tiposResiduo
                  .filter((tipo) => tipo.id !== undefined)
                  .map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id?.toString() || ''}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: tipo.corHex }}
                        />
                        {tipo.nome}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
          {!tipoResiduoId && (
            <p className="text-muted-foreground text-xs">
              Selecione um tipo de resíduo para visualizar as rotas
            </p>
          )}
        </div>

        {tipoResiduoId && rotasDisponiveis.length === 0 && (
          <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-center">
            <p className="text-muted-foreground text-sm">
              Nenhuma rota encontrada para este tipo de resíduo
            </p>
          </div>
        )}

        {tipoResiduoId && rotasDisponiveis.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="rota">Filtrar por Rota</Label>
            <Select
              onValueChange={(value) =>
                onRotaChange(value === 'all' ? null : Number(value))
              }
              value={rotaId?.toString() || 'all'}
            >
              <SelectTrigger id="rota">
                <SelectValue placeholder="Todas as rotas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as rotas</SelectItem>
                {rotasDisponiveis.map((rota) => (
                  <SelectItem key={rota.id} value={rota.id?.toString() || ''}>
                    {rota.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {tipoResiduoId && rotasFiltradas.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="periodo">Período dos Trajetos</Label>
            <Select
              onValueChange={(value) => setPeriodoDias(Number(value))}
              value={periodoDias.toString()}
            >
              <SelectTrigger id="periodo">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="15">Últimos 15 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="60">Últimos 60 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {tipoResiduoId && rotasFiltradas.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="trajeto">Comparar com Trajeto</Label>
            {isLoadingTrajetos && <Skeleton className="h-10 w-full" />}

            {!isLoadingTrajetos && trajetosFiltrados.length === 0 && (
              <p className="text-muted-foreground text-xs">
                Nenhum trajeto finalizado encontrado
              </p>
            )}

            {!isLoadingTrajetos && trajetosFiltrados.length > 0 && (
              <Select
                onValueChange={(value) =>
                  onTrajetoChange(value === 'none' ? null : Number(value))
                }
                value={trajetoId?.toString() || 'none'}
              >
                <SelectTrigger id="trajeto">
                  <SelectValue placeholder="Nenhum trajeto selecionado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {trajetosFiltrados.map((trajeto) => {
                    const rota = rotas.find((r) => r.id === trajeto.rotaId)
                    return (
                      <SelectItem
                        key={trajeto.id}
                        value={trajeto.id.toString()}
                      >
                        {rota?.nome} -{' '}
                        {new Date(trajeto.dataInicio).toLocaleDateString(
                          'pt-BR'
                        )}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {tipoResiduoId && (
          <div className="space-y-2 border-t pt-4">
            <Label>Legenda</Label>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border bg-primary/30" />
                <span>Área Planejada</span>
              </div>
              {trajetoId && (
                <div className="flex items-center gap-2">
                  <div className="h-1 w-8 rounded bg-red-500" />
                  <span>Trajeto Realizado</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
