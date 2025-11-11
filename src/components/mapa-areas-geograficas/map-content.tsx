import type L from 'leaflet'
import { useCallback, useRef } from 'react'
import {
  MapContainer,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Rota } from '@/http/rotas/types'
import type { TipoColeta } from '@/http/tipo-coleta/types'
import type { TipoResiduo } from '@/http/tipo-residuo/types'
import type { PontoTrajeto, Trajeto } from '@/http/trajeto/types'
import { MapControls } from './map-controls'
import { RoutePopup } from './route-popup'

type MapContentProps = {
  tipoResiduoId: number | null
  rotasFiltradas: Rota[]
  pontosTrajeto?: PontoTrajeto[]
  trajetoSelecionado?: Trajeto
  isLoadingRotas: boolean
  center: [number, number]
  tiposResiduo: TipoResiduo[]
  tiposColeta: TipoColeta[]
}

export function MapContent({
  tipoResiduoId,
  rotasFiltradas,
  pontosTrajeto,
  trajetoSelecionado,
  isLoadingRotas,
  center,
  tiposResiduo,
  tiposColeta,
}: MapContentProps) {
  const mapRef = useRef<L.Map | null>(null)

  const handleResetView = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, 13)
    }
  }, [center])

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Function handles bounds calculation for multiple routes
  const handleFitBounds = useCallback(() => {
    if (mapRef.current && rotasFiltradas.length > 0) {
      const bounds: L.LatLngBoundsExpression = []

      for (const rota of rotasFiltradas) {
        if (rota.areaGeografica?.coordinates?.[0]) {
          for (const [lng, lat] of rota.areaGeografica.coordinates[0]) {
            bounds.push([lat, lng])
          }
        }
      }

      if (bounds.length > 0) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [rotasFiltradas])
  if (!tipoResiduoId) {
    return (
      <Card className="flex h-full flex-col overflow-hidden">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">Selecione um Tipo de Resíduo</h3>
            <p className="mt-2 text-muted-foreground text-sm">
              Escolha um tipo de resíduo no filtro ao lado para visualizar as
              rotas
            </p>
          </div>
        </div>
      </Card>
    )
  }

  if (isLoadingRotas) {
    return (
      <Card className="flex h-full flex-col overflow-hidden">
        <div className="flex h-full items-center justify-center">
          <Skeleton className="h-full w-full" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative h-full">
        <MapContainer
          center={center}
          ref={mapRef}
          style={{ height: '100%', width: '100%' }}
          zoom={13}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {rotasFiltradas.map((rota) => {
            if (!rota.areaGeografica?.coordinates?.[0]) {
              return null
            }

            const positions = rota.areaGeografica.coordinates[0].map(
              ([lng, lat]) => [lat, lng] as [number, number]
            )

            const tipoResiduo = tiposResiduo.find(
              (t) => t.id === rota.tipoResiduoId
            )
            const tipoColeta = tiposColeta.find(
              (t) => t.id === rota.tipoColetaId
            )

            return (
              <Polygon
                key={rota.id}
                pathOptions={{
                  color: 'oklch(0.62 0.24 261.67)',
                  fillColor: 'oklch(0.62 0.24 261.67)',
                  fillOpacity: 0.2,
                  weight: 2,
                }}
                positions={positions}
              >
                <Popup maxWidth={320} minWidth={280}>
                  <RoutePopup
                    rota={rota}
                    tipoColetaNome={tipoColeta?.nome}
                    tipoResiduoColor={tipoResiduo?.corHex}
                    tipoResiduoNome={tipoResiduo?.nome}
                  />
                </Popup>
              </Polygon>
            )
          })}

          {pontosTrajeto && pontosTrajeto.length > 0 && (
            <Polyline
              pathOptions={{
                color: '#ef4444',
                weight: 3,
                opacity: 0.8,
              }}
              positions={pontosTrajeto.map(
                (ponto) => [ponto.latitude, ponto.longitude] as [number, number]
              )}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">Trajeto Realizado</p>
                  {trajetoSelecionado && (
                    <p className="text-xs">
                      {new Date(trajetoSelecionado.dataInicio).toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs">
                    {pontosTrajeto.length} pontos registrados
                  </p>
                </div>
              </Popup>
            </Polyline>
          )}
        </MapContainer>

        <MapControls
          hasRoutes={rotasFiltradas.length > 0}
          onFitBounds={handleFitBounds}
          onResetView={handleResetView}
        />
      </div>
    </Card>
  )
}
