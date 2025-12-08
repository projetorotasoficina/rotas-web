import { FileSpreadsheet, FileText } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type {
  ExportFormat,
  ExportOptions,
  GenericReportData,
} from '@/http/relatorios/types'
import { exportToExcel } from '@/lib/export/export-to-excel'
import { exportToPDF } from '@/lib/export/export-to-pdf'

type ExportScope = 'filtered' | 'all'

type ExportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: GenericReportData
  options: ExportOptions
  description?: string
  onFetchAll?: () => Promise<GenericReportData>
  hasFilters?: boolean
}

export function ExportDialog({
  open,
  onOpenChange,
  data,
  options,
  description = 'Escolha o formato e os dados para exportar',
  onFetchAll,
  hasFilters = false,
}: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf')
  const [selectedScope, setSelectedScope] = useState<ExportScope>('filtered')

  const handleExport = async () => {
    setIsExporting(true)

    try {
      let exportData = data

      // If user selected "all" and we have a fetch function, get all data
      if (selectedScope === 'all' && onFetchAll) {
        exportData = await onFetchAll()
      }

      if (selectedFormat === 'pdf') {
        exportToPDF(exportData, options)
        toast.success('PDF gerado com sucesso!')
      } else {
        exportToExcel(exportData, options)
        toast.success('Excel gerado com sucesso!')
      }
      onOpenChange(false)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido'
      toast.error(`Erro ao gerar arquivo: ${message}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar Relatório</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="font-semibold text-sm">Formato</Label>
            <RadioGroup
              onValueChange={(value) =>
                setSelectedFormat(value as ExportFormat)
              }
              value={selectedFormat}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="format-pdf" value="pdf" />
                <Label
                  className="flex cursor-pointer items-center gap-2"
                  htmlFor="format-pdf"
                >
                  <FileText className="h-4 w-4" />
                  <span>PDF</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="format-excel" value="excel" />
                <Label
                  className="flex cursor-pointer items-center gap-2"
                  htmlFor="format-excel"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Excel</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Scope Selection (only show if onFetchAll is provided) */}
          {onFetchAll && (
            <div className="space-y-3">
              <Label className="font-semibold text-sm">Dados</Label>
              <RadioGroup
                onValueChange={(value) =>
                  setSelectedScope(value as ExportScope)
                }
                value={selectedScope}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="scope-filtered" value="filtered" />
                  <Label className="cursor-pointer" htmlFor="scope-filtered">
                    <div>
                      <div className="font-medium">Apenas filtrados</div>
                      <div className="text-muted-foreground text-xs">
                        {hasFilters
                          ? 'Exportar apenas os registros com os filtros aplicados'
                          : 'Exportar todos os registros (nenhum filtro aplicado)'}
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="scope-all" value="all" />
                  <Label className="cursor-pointer" htmlFor="scope-all">
                    <div>
                      <div className="font-medium">Todos os registros</div>
                      <div className="text-muted-foreground text-xs">
                        Ignorar filtros e exportar todos os registros
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-end gap-2">
          <Button
            disabled={isExporting}
            onClick={() => onOpenChange(false)}
            variant="ghost"
          >
            Cancelar
          </Button>
          <Button disabled={isExporting} onClick={handleExport}>
            {isExporting ? 'Gerando...' : 'Gerar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
