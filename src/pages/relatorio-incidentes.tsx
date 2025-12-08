import { Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { ExportDialog } from '@/components/relatorios'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useListRotas } from '@/http/rotas/use-list-rotas'
import { fetchWithAuth } from '@/services/api'

type IncidenteRelatorio = {
  id: number
  trajetoId: number
  nome: string
  observacoes: string | null
  ts: string
  latitude: number | null
  longitude: number | null
}

type IncidenteAPI = {
  id: number
  trajetoId: number
  nome: string
  observacoes: string | null
  ts: string
  latitude?: number | null
  longitude?: number | null
}

function getDefaultDateRange() {
  const hoje = new Date()
  const umMesAtras = new Date(hoje)
  umMesAtras.setMonth(hoje.getMonth() - 1)

  return {
    dataInicio: umMesAtras.toISOString().split('T')[0],
    dataFim: hoje.toISOString().split('T')[0],
  }
}

async function fetchIncidentes(
  dataInicio: string,
  dataFim: string,
  rotaId: string
): Promise<IncidenteRelatorio[]> {
  const filters: string[] = [
    `ts>=${encodeURIComponent(`${dataInicio}T00:00:00`)}`,
    `ts<=${encodeURIComponent(`${dataFim}T23:59:59`)}`,
  ]

  if (rotaId) {
    filters.push(`trajeto.rotaId=${encodeURIComponent(rotaId)}`)
  }

  const url = `/v1/reports/generic/incidente?${filters.join('&')}`
  const response = await fetchWithAuth(url)

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`)
  }

  const data = await response.json()

  if (!Array.isArray(data)) {
    throw new Error('Formato de resposta inválido')
  }

  return data.map((item: IncidenteAPI) => ({
    id: item.id,
    trajetoId: item.trajetoId,
    nome: item.nome,
    observacoes: item.observacoes,
    ts: item.ts,
    latitude: item.latitude ?? null,
    longitude: item.longitude ?? null,
  }))
}

export default function RelatorioIncidentesPage() {
  const { dataInicio: defaultInicio, dataFim: defaultFim } =
    getDefaultDateRange()

  const [dataInicio, setDataInicio] = useState(defaultInicio)
  const [dataFim, setDataFim] = useState(defaultFim)
  const [rotaId, setRotaId] = useState('')
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [reportData, setReportData] = useState<IncidenteRelatorio[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { data: rotas = [], isLoading: isLoadingRotas } = useListRotas()

  const handleGerarRelatorio = async () => {
    if (!(dataInicio && dataFim)) {
      toast.error('Selecione o período (data início e fim)')
      return
    }

    setIsLoading(true)

    try {
      const dados = await fetchIncidentes(dataInicio, dataFim, rotaId)

      if (dados.length === 0) {
        toast.info('Nenhum incidente encontrado no período selecionado')
        return
      }

      setReportData(dados)
      setShowExportDialog(true)
      toast.success(`${dados.length} incidente(s) encontrado(s)`)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido'
      toast.error(`Erro ao gerar relatório: ${message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getExportData = () => {
    return reportData.map((inc) => {
      const dados: Record<string, string | number> = {
        tipo: inc.nome,
        data: new Date(inc.ts).toLocaleString('pt-BR'),
      }

      if (inc.trajetoId) {
        dados.trajeto = `Trajeto #${inc.trajetoId}`
      }

      if (inc.observacoes) {
        dados.observacoes = inc.observacoes
      }

      if (inc.latitude != null && inc.longitude != null) {
        dados.latitude = inc.latitude.toFixed(6)
        dados.longitude = inc.longitude.toFixed(6)
      }

      return dados
    })
  }

  const getExportColumns = () => {
    const dadosFormatados = getExportData()
    const columns = [
      { key: 'tipo', label: 'Tipo de Incidente' },
      { key: 'data', label: 'Data/Hora' },
    ]

    if (dadosFormatados.some((d) => d.trajeto)) {
      columns.push({ key: 'trajeto', label: 'Trajeto' })
    }

    if (dadosFormatados.some((d) => d.observacoes)) {
      columns.push({ key: 'observacoes', label: 'Observações' })
    }

    if (dadosFormatados.some((d) => d.latitude)) {
      columns.push({ key: 'latitude', label: 'Latitude' })
      columns.push({ key: 'longitude', label: 'Longitude' })
    }

    return columns
  }

  const handleLimparFiltros = () => {
    const defaults = getDefaultDateRange()
    setDataInicio(defaults.dataInicio)
    setDataFim(defaults.dataFim)
    setRotaId('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-bold text-xl tracking-tight sm:text-2xl">
            Relatório de Incidentes
          </h1>
          <p className="text-muted-foreground text-sm">
            Analise os incidentes registrados durante as coletas
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração do Relatório</CardTitle>
          <CardDescription>
            Defina o período e aplique filtros opcionais para gerar o relatório
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <Label className="font-semibold text-base">Período *</Label>
                <Badge variant="secondary">Obrigatório</Badge>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data Início</Label>
                  <Input
                    id="dataInicio"
                    onChange={(e) => setDataInicio(e.target.value)}
                    required
                    type="date"
                    value={dataInicio}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataFim">Data Fim</Label>
                  <Input
                    id="dataFim"
                    onChange={(e) => setDataFim(e.target.value)}
                    required
                    type="date"
                    value={dataFim}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="font-semibold text-base">
                Filtros Opcionais
              </Label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rota">Rota</Label>
                  <Select
                    disabled={isLoadingRotas}
                    onValueChange={setRotaId}
                    value={rotaId}
                  >
                    <SelectTrigger id="rota">
                      <SelectValue placeholder="Todas as rotas" />
                    </SelectTrigger>
                    <SelectContent>
                      {rotas.map((r) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              disabled={isLoading}
              onClick={handleGerarRelatorio}
              size="lg"
            >
              <Download className="h-4 w-4" />
              {isLoading ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
            <Button onClick={handleLimparFiltros} size="lg" variant="outline">
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <ExportDialog
        data={getExportData()}
        description={`${reportData.length} incidente(s) encontrado(s)`}
        onOpenChange={setShowExportDialog}
        open={showExportDialog}
        options={{
          filename: `relatorio-incidentes-${dataInicio}-${dataFim}`,
          title: 'Relatório de Incidentes',
          columns: getExportColumns(),
        }}
      />
    </div>
  )
}
