import { AlertTriangle, Truck } from 'lucide-react'

type MapLegendProps = {
  routeColor: string
}

export function MapLegend({ routeColor }: MapLegendProps) {
  return (
    <div className="absolute bottom-2 left-2 z-[1000] rounded-lg border bg-card/95 p-3 shadow-lg backdrop-blur-sm">
      <h4 className="mb-2 font-semibold text-muted-foreground text-xs">
        LEGENDA
      </h4>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
            <div className="h-2 w-2 rounded-full bg-white" />
          </div>
          <span className="text-xs">Início da rota</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
            <div className="h-2 w-2 rounded-full bg-white" />
          </div>
          <span className="text-xs">Fim da rota</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
            <Truck className="h-3 w-3 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xs">Posição atual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500">
            <AlertTriangle className="h-3 w-3 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xs">Incidente</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-0.5 w-5 opacity-70"
            style={{ backgroundColor: routeColor }}
          />
          <span className="text-xs">Trajeto</span>
        </div>
      </div>
    </div>
  )
}
