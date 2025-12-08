import { Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useLazyGenericReport } from '@/http/relatorios'
import type {
  ExportOptions,
  GenericReportParams,
} from '@/http/relatorios/types'
import { ExportDialog } from './export-dialog'

type LazyExportButtonProps = {
  reportParams: GenericReportParams
  options: ExportOptions
  disabled?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  enableScopeSelection?: boolean
  totalRecords?: number
}

export function LazyExportButton({
  reportParams,
  options,
  disabled = false,
  size = 'default',
  variant = 'outline',
  enableScopeSelection = false,
  totalRecords,
}: LazyExportButtonProps) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<Record<string, unknown>[]>([])
  const { fetchReport, isLoading } = useLazyGenericReport()

  const hasFilters =
    reportParams.filters &&
    Object.keys(reportParams.filters).some(
      (key) =>
        reportParams.filters?.[key] !== undefined &&
        reportParams.filters?.[key] !== null &&
        reportParams.filters?.[key] !== ''
    )

  const handleClick = async () => {
    try {
      const reportData = await fetchReport(reportParams)
      setData(reportData)
      setOpen(true)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao buscar dados'
      toast.error(`Erro ao gerar relatório: ${message}`)
    }
  }

  const handleFetchAll = async () => {
    // Fetch all records without filters
    const paramsWithoutFilters: GenericReportParams = {
      entityName: reportParams.entityName,
      filters: {},
    }
    const allData = await fetchReport(paramsWithoutFilters)
    return allData
  }

  return (
    <>
      <Button
        disabled={disabled || isLoading}
        onClick={handleClick}
        size={size}
        variant={variant}
      >
        <Download className="h-4 w-4" />
        {isLoading ? 'Carregando...' : 'Exportar'}
      </Button>

      <ExportDialog
        data={data}
        hasFilters={hasFilters}
        onFetchAll={enableScopeSelection ? handleFetchAll : undefined}
        onOpenChange={setOpen}
        open={open}
        options={{ ...options, totalRecords }}
      />
    </>
  )
}
