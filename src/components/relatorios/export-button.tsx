import { Download } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { ExportOptions, GenericReportData } from '@/http/relatorios/types'
import { ExportDialog } from './export-dialog'

type ExportButtonProps = {
  data: GenericReportData
  options: ExportOptions
  disabled?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
}

export function ExportButton({
  data,
  options,
  disabled = false,
  size = 'default',
  variant = 'outline',
}: ExportButtonProps) {
  const [open, setOpen] = useState(false)
  const exportData = data || []
  const isDisabled = disabled || exportData.length === 0

  return (
    <>
      <Button
        disabled={isDisabled}
        onClick={() => setOpen(true)}
        size={size}
        variant={variant}
      >
        <Download className="h-4 w-4" />
        Exportar
      </Button>

      <ExportDialog
        data={exportData}
        onOpenChange={setOpen}
        open={open}
        options={options}
      />
    </>
  )
}
