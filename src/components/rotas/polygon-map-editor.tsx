import type L from 'leaflet'
import type { LatLng } from 'leaflet'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, Polygon, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Trash2, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PolygonGeoJson = {
  type: 'Polygon'
  coordinates: number[][][]
}

type PolygonMapEditorProps = {
  value?: PolygonGeoJson | null
  onChange: (polygon: PolygonGeoJson | null) => void
  center?: [number, number]
}

function MapEventsHandler({
  onAddPoint,
}: {
  onAddPoint: (point: LatLng) => void
}) {
  useMapEvents({
    click: (e) => {
      onAddPoint(e.latlng)
    },
  })

  return null
}

export function PolygonMapEditor({
  value,
  onChange,
  center = [-26.2289, -52.6703], // Pato Branco, PR
}: PolygonMapEditorProps) {
  const [points, setPoints] = useState<LatLng[]>([])
  const mapRef = useRef<L.Map | null>(null)

  // Carregar polígono existente
  useEffect(() => {
    if (value?.coordinates?.[0]) {
      const loadedPoints = value.coordinates[0].map(
        ([lng, lat]) =>
          ({
            lat,
            lng,
          }) as LatLng
      )
      // Remove o último ponto se for igual ao primeiro (fechamento do polígono)
      if (loadedPoints.length > 1) {
        const first = loadedPoints[0]
        const last = loadedPoints.at(-1)
        if (last && first.lat === last.lat && first.lng === last.lng) {
          loadedPoints.pop()
        }
      }
      setPoints(loadedPoints)
    }
  }, [value])

  const handleAddPoint = (point: LatLng) => {
    const newPoints = [...points, point]
    setPoints(newPoints)

    // Precisa de pelo menos 3 pontos para formar um polígono
    if (newPoints.length >= 3) {
      updatePolygon(newPoints)
    }
  }

  const updatePolygon = (pts: LatLng[]) => {
    // Converter para formato GeoJSON [longitude, latitude]
    const coordinates = pts.map((p) => [p.lng, p.lat])
    // Fechar o polígono (primeiro ponto = último ponto)
    coordinates.push(coordinates[0])

    onChange({
      type: 'Polygon',
      coordinates: [coordinates],
    })
  }

  const handleUndo = () => {
    if (points.length === 0) {
      return
    }

    const newPoints = points.slice(0, -1)
    setPoints(newPoints)

    if (newPoints.length >= 3) {
      updatePolygon(newPoints)
    } else {
      onChange(null)
    }
  }

  const handleClear = () => {
    setPoints([])
    onChange(null)
  }

  // Preparar posições para o Polygon do Leaflet
  const polygonPositions = points.map((p) => [p.lat, p.lng] as [number, number])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          {points.length === 0 && 'Clique no mapa para adicionar pontos'}
          {points.length > 0 && points.length < 3 && (
            <>
              {points.length} {points.length === 1 ? 'ponto' : 'pontos'} -
              mínimo 3 para formar um polígono
            </>
          )}
          {points.length >= 3 && (
            <>Polígono com {points.length} pontos definido</>
          )}
        </p>
        <div className="flex gap-2">
          {points.length > 0 && (
            <Button
              onClick={handleUndo}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          )}
          {points.length > 0 && (
            <Button
              onClick={handleClear}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="h-[400px] overflow-hidden rounded-lg border lg:h-[500px]">
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

          <MapEventsHandler onAddPoint={handleAddPoint} />

          {points.length >= 3 && (
            <Polygon
              pathOptions={{
                color: 'oklch(0.62 0.24 261.67)',
                fillColor: 'oklch(0.62 0.24 261.67)',
                fillOpacity: 0.3,
              }}
              positions={polygonPositions}
            />
          )}
        </MapContainer>
      </div>
    </div>
  )
}
