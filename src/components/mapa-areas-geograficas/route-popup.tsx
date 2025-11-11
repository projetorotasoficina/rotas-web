import { Calendar, MapPin, Package, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Rota } from '@/http/rotas/types'
import { DIA_SEMANA_LABEL, PERIODO_ICON, PERIODO_LABEL } from '@/lib/map-utils'

type RoutePopupProps = {
  rota: Rota
  tipoResiduoNome?: string
  tipoResiduoColor?: string
  tipoColetaNome?: string
  onEditClick?: () => void
}

export function RoutePopup({
  rota,
  tipoResiduoNome,
  tipoResiduoColor,
  tipoColetaNome,
  onEditClick,
}: RoutePopupProps) {
  return (
    <div className="min-w-[280px] space-y-3">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base">{rota.nome}</h3>
          <Badge variant={rota.ativo ? 'default' : 'secondary'}>
            {rota.ativo ? 'Ativa' : 'Inativa'}
          </Badge>
        </div>
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        {tipoResiduoNome && (
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Resíduo:</span>
            <div className="flex items-center gap-1.5">
              {tipoResiduoColor && (
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: tipoResiduoColor }}
                />
              )}
              <span className="font-medium">{tipoResiduoNome}</span>
            </div>
          </div>
        )}

        {tipoColetaNome && (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Coleta:</span>
            <span className="font-medium">{tipoColetaNome}</span>
          </div>
        )}

        {rota.areaGeografica?.coordinates?.[0] && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Área:</span>
            <span className="font-medium">
              {rota.areaGeografica.coordinates[0].length - 1} pontos
            </span>
          </div>
        )}
      </div>

      {rota.frequencias && rota.frequencias.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-muted-foreground">
                Frequências:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {rota.frequencias.map((freq) => (
                <Badge
                  className="text-xs"
                  key={`${freq.diaSemana}-${freq.periodo}`}
                  variant="outline"
                >
                  {PERIODO_ICON[freq.periodo]}{' '}
                  {DIA_SEMANA_LABEL[freq.diaSemana]} -{' '}
                  {PERIODO_LABEL[freq.periodo]}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {rota.observacoes && (
        <>
          <Separator />
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground text-xs">
              Observações:
            </p>
            <p className="text-muted-foreground text-xs">{rota.observacoes}</p>
          </div>
        </>
      )}

      {onEditClick && (
        <>
          <Separator />
          <Button
            className="w-full"
            onClick={onEditClick}
            size="sm"
            variant="outline"
          >
            Ver detalhes da rota
          </Button>
        </>
      )}
    </div>
  )
}
