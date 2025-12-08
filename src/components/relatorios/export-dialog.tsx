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
import type {
  ExportFormat,
  ExportOptions,
  GenericReportData,
} from '@/http/relatorios/types'
import { exportToExcel } from '@/lib/export/export-to-excel'
import { exportToPDF } from '@/lib/export/export-to-pdf'

type ExportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: GenericReportData
  options: ExportOptions
  description?: string
}

export function ExportDialog({
  open,
  onOpenChange,
  data,
  options,
  description = 'Escolha o formato de exportação desejado',
}: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = (format: ExportFormat) => {
    setIsExporting(true)

    try {
      if (format === 'pdf') {
        exportToPDF(data, options)
        toast.success('PDF gerado com sucesso!')
      } else {
        exportToExcel(data, options)
        toast.success('Excel gerado com sucesso!')
      }
      onOpenChange(false)
    } catch {
      toast.error('Erro ao gerar arquivo. Tente novamente.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar Relatório</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            className="h-24 flex-col gap-2"
            disabled={isExporting}
            onClick={() => handleExport('pdf')}
            variant="outline"
          >
            <FileText className="h-8 w-8" />
            <span>PDF</span>
          </Button>

          <Button
            className="h-24 flex-col gap-2"
            disabled={isExporting}
            onClick={() => handleExport('excel')}
            variant="outline"
          >
            <FileSpreadsheet className="h-8 w-8" />
            <span>Excel</span>
          </Button>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="ghost">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
