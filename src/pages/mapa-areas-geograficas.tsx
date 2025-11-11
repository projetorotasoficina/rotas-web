import { useState } from 'react'
import { FilterSidebar } from '@/components/mapa-areas-geograficas/filter-sidebar'
import { MapContent } from '@/components/mapa-areas-geograficas/map-content'
import { useListRotas } from '@/http/rotas/use-list-rotas'
import { useListTipoColeta } from '@/http/tipo-coleta/use-list-tipo-coleta'
import { useListTipoResiduo } from '@/http/tipo-residuo/use-list-tipo-residuo'
import { useGetTrajetoPontos } from '@/http/trajeto/use-get-trajeto-pontos'
import { usePaginatedTrajetos } from '@/http/trajeto/use-paginated-trajetos'

export function MapaAreasGeograficas() {
  const [tipoResiduoId, setTipoResiduoId] = useState<number | null>(null)
  const [rotaId, setRotaId] = useState<number | null>(null)
  const [trajetoId, setTrajetoId] = useState<number | null>(null)

  const { data: tiposResiduo = [], isLoading: isLoadingTipos } =
    useListTipoResiduo()
  const { data: tiposColeta = [] } = useListTipoColeta()
  const { data: rotas = [], isLoading: isLoadingRotas } = useListRotas()
  const { data: trajetosData, isLoading: isLoadingTrajetos } =
    usePaginatedTrajetos({
      page: 0,
      size: 100,
      order: 'id',
      asc: false,
    })

  const trajetos = trajetosData?.content || []

  // Buscar pontos do trajeto selecionado
  const { data: pontosTrajeto } = useGetTrajetoPontos(trajetoId || undefined)

  // Filtrar rotas ativas por tipo de resíduo e rota específica
  const rotasFiltradas = rotas.filter(
    (rota) =>
      rota.ativo &&
      rota.areaGeografica &&
      (!tipoResiduoId || rota.tipoResiduoId === tipoResiduoId) &&
      (!rotaId || rota.id === rotaId)
  )

  // Encontrar trajeto selecionado
  const trajetoSelecionado = trajetos.find((t) => t.id === trajetoId)

  // Centro do mapa (Pato Branco, PR)
  const center: [number, number] = [-26.2289, -52.6703]

  return (
    <div className="flex h-full flex-col gap-4 pb-4 lg:h-[calc(100vh-7rem)] lg:gap-4 lg:pb-0">
      <div>
        <h1 className="font-bold text-xl tracking-tight sm:text-2xl">
          Mapa de Áreas Geográficas
        </h1>
        <p className="text-muted-foreground text-sm">
          Visualize as áreas planejadas das rotas e compare com os trajetos
          realizados
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden lg:grid lg:grid-cols-[320px_1fr]">
        <FilterSidebar
          isLoadingTipos={isLoadingTipos}
          isLoadingTrajetos={isLoadingTrajetos}
          onRotaChange={setRotaId}
          onTipoResiduoChange={setTipoResiduoId}
          onTrajetoChange={setTrajetoId}
          rotaId={rotaId}
          rotas={rotas}
          rotasFiltradas={rotasFiltradas}
          tipoResiduoId={tipoResiduoId}
          tiposResiduo={tiposResiduo}
          trajetoId={trajetoId}
          trajetos={trajetos}
        />
        <MapContent
          center={center}
          isLoadingRotas={isLoadingRotas}
          pontosTrajeto={pontosTrajeto}
          rotasFiltradas={rotasFiltradas}
          tipoResiduoId={tipoResiduoId}
          tiposColeta={tiposColeta}
          tiposResiduo={tiposResiduo}
          trajetoSelecionado={trajetoSelecionado}
        />
      </div>
    </div>
  )
}
