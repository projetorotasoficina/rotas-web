/** biome-ignore-all lint/style/noMagicNumbers: não necessário */
import type { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouteAnimation } from '@/hooks/use-route-animation'
import type { TrajetoComPontos } from '@/http/trajeto/types'
import { AnimationControls } from './animation-controls'
import { MapLegend } from './map-legend'

// @ts-expect-error - Leaflet icon fix
L.Icon.Default.prototype._getIconUrl = undefined
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

const startIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
      <path fill="#22c55e" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.4 12.5 28.5 12.5 28.5S25 20.9 25 12.5C25 5.6 19.4 0 12.5 0z"/>
      <circle cx="12.5" cy="12.5" r="6" fill="#fff"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
})

const endIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
      <path fill="#ef4444" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.4 12.5 28.5 12.5 28.5S25 20.9 25 12.5C25 5.6 19.4 0 12.5 0z"/>
      <circle cx="12.5" cy="12.5" r="6" fill="#fff"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
})

const truckIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="#3b82f6" stroke="#fff" stroke-width="2"/>
      <g transform="translate(8, 8) scale(0.67)">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M15 18H9" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="17" cy="18" r="2" stroke="#fff" stroke-width="2" fill="none"/>
        <circle cx="7" cy="18" r="2" stroke="#fff" stroke-width="2" fill="none"/>
      </g>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
})

const incidentIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="#f59e0b" stroke="#fff" stroke-width="2"/>
      <g transform="translate(8, 8) scale(0.67)">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M12 9v4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 17h.01" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
})

type ResetMapViewProps = {
  center: LatLngExpression
  zoom: number
}

function ResetMapView({ center, zoom }: ResetMapViewProps) {
  const map = useMap()

  const handleReset = () => {
    map.setView(center, zoom)
  }

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '10px' }}>
      <div className="leaflet-control leaflet-bar">
        <Button
          className="h-[30px] w-[30px] rounded-sm bg-white p-0 shadow-md hover:bg-gray-50"
          onClick={handleReset}
          size="icon"
          title="Resetar visualização do mapa"
        >
          <RotateCcw className="h-4 w-4 text-gray-700" />
        </Button>
      </div>
    </div>
  )
}

type RouteMapProps = {
  trajeto: TrajetoComPontos
}

export function RouteMap({ trajeto }: RouteMapProps) {
  const { pontos, incidentes = [] } = trajeto
  const [speed, setSpeed] = useState(100)

  const animation = useRouteAnimation({ pontos, speed })

  const positions: LatLngExpression[] = useMemo(
    () =>
      pontos && pontos.length > 0
        ? pontos.map((ponto) => [ponto.latitude, ponto.longitude])
        : [],
    [pontos]
  )

  const center: LatLngExpression = useMemo(() => {
    if (!pontos || pontos.length === 0) {
      return [0, 0]
    }
    const centerLat =
      pontos.reduce((sum, p) => sum + p.latitude, 0) / pontos.length
    const centerLng =
      pontos.reduce((sum, p) => sum + p.longitude, 0) / pontos.length
    return [centerLat, centerLng]
  }, [pontos])

  const firstPoint = pontos?.[0]
  const lastPoint = pontos?.[pontos.length - 1]
  const routeColor = trajeto.tipoResiduo?.corHex || '#3b82f6'

  const truckPosition: LatLngExpression = useMemo(() => {
    if (animation.currentPoint) {
      return [animation.currentPoint.latitude, animation.currentPoint.longitude]
    }
    if (firstPoint) {
      return [firstPoint.latitude, firstPoint.longitude]
    }
    return [0, 0]
  }, [animation.currentPoint, firstPoint])

  if (!pontos || pontos.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-lg border bg-muted/50">
        <p className="text-muted-foreground">
          Nenhum ponto registrado neste trajeto
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative z-40 h-[500px] w-full overflow-hidden rounded-lg border">
        <MapContainer
          center={center}
          className="h-full w-full"
          scrollWheelZoom={true}
          zoom={14}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ResetMapView center={center} zoom={15} />

          <Polyline
            color={routeColor}
            opacity={0.7}
            positions={positions}
            weight={4}
          />

          <Marker icon={truckIcon} position={truckPosition}>
            <Popup>
              <div className="text-sm">
                <strong className="text-blue-600">Caminhão em Movimento</strong>
                <br />
                Ponto {animation.currentIndex + 1} de {animation.totalPoints}
                {animation.currentPoint && (
                  <>
                    <br />
                    {format(
                      new Date(animation.currentPoint.horario),
                      "dd/MM/yyyy 'às' HH:mm",
                      {
                        locale: ptBR,
                      }
                    )}
                  </>
                )}
              </div>
            </Popup>
          </Marker>

          {firstPoint && (
            <Marker
              icon={startIcon}
              position={[firstPoint.latitude, firstPoint.longitude]}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="text-green-600">Início da Rota</strong>
                  <br />
                  {format(
                    new Date(firstPoint.horario),
                    "dd/MM/yyyy 'às' HH:mm",
                    {
                      locale: ptBR,
                    }
                  )}
                  {firstPoint.observacao && (
                    <>
                      <br />
                      <span className="text-muted-foreground">
                        {firstPoint.observacao}
                      </span>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          )}

          {incidentes.map((incidente) => {
            if (!(incidente.lat && incidente.lng)) {
              return null
            }

            return (
              <Marker
                icon={incidentIcon}
                key={incidente.id}
                position={[incidente.lat, incidente.lng]}
              >
                <Popup>
                  <div className="text-sm">
                    <strong className="text-amber-600">⚠️ Incidente</strong>
                    <br />
                    <span className="font-semibold">{incidente.nome}</span>
                    <br />
                    {format(new Date(incidente.ts), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                    {incidente.observacoes && (
                      <>
                        <br />
                        <span className="text-muted-foreground">
                          {incidente.observacoes}
                        </span>
                      </>
                    )}
                    {incidente.fotoUrl && (
                      <>
                        <br />
                        <a
                          className="text-blue-600 hover:underline"
                          href={incidente.fotoUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Ver foto
                        </a>
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          })}

          {lastPoint && (
            <Marker
              icon={endIcon}
              position={[lastPoint.latitude, lastPoint.longitude]}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="text-red-600">Fim da Rota</strong>
                  <br />
                  {format(
                    new Date(lastPoint.horario),
                    "dd/MM/yyyy 'às' HH:mm",
                    {
                      locale: ptBR,
                    }
                  )}
                  {lastPoint.observacao && (
                    <>
                      <br />
                      <span className="text-muted-foreground">
                        {lastPoint.observacao}
                      </span>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        <MapLegend routeColor={routeColor} />
      </div>

      <AnimationControls
        currentIndex={animation.currentIndex}
        isPlaying={animation.isPlaying}
        onPause={animation.pause}
        onPlay={animation.play}
        onReset={animation.reset}
        onSpeedChange={setSpeed}
        progress={animation.progress}
        speed={speed}
        totalPoints={animation.totalPoints}
      />
    </div>
  )
}
