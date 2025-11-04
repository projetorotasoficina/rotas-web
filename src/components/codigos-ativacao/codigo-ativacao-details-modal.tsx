/** biome-ignore-all lint/a11y/noLabelWithoutControl: não necessário */
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { CodigoAtivacao } from '@/http/codigos-ativacao/types'

type CodigoAtivacaoDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  codigo: CodigoAtivacao | null
}

export function CodigoAtivacaoDetailsModal({
  isOpen,
  onClose,
  codigo,
}: CodigoAtivacaoDetailsModalProps) {
  if (!codigo) {
    return null
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copiado para área de transferência!`)
  }

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Código de Ativação</DialogTitle>
          <DialogDescription>
            Informações completas sobre o código de ativação do dispositivo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="font-medium text-sm">Status</span>
            <Badge variant={codigo.ativo ? 'default' : 'destructive'}>
              {codigo.ativo ? 'Ativo' : 'Revogado'}
            </Badge>
          </div>

          {codigo.deviceId && (
            <div className="space-y-2">
              <label className="font-medium text-sm">Device ID</label>
              <div className="flex items-center gap-2 rounded-md border bg-muted p-3">
                <code className="flex-1 font-mono text-xs">
                  {codigo.deviceId}
                </code>
                <Button
                  className="h-7 w-7 p-0"
                  onClick={() => handleCopy(codigo.deviceId ?? '', 'Device ID')}
                  size="sm"
                  variant="ghost"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="font-medium text-sm">Código de Ativação</label>
            <div className="flex items-center gap-2 rounded-md border bg-muted p-3">
              <code className="flex-1 font-mono text-lg">{codigo.codigo}</code>
              <Button
                className="h-7 w-7 p-0"
                onClick={() => handleCopy(codigo.codigo, 'Código')}
                size="sm"
                variant="ghost"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">
                Data de Geração
              </label>
              <p className="text-sm">
                {new Date(codigo.dataGeracao).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">
                Status de Uso
              </label>
              <div>
                <Badge variant={codigo.usado ? 'secondary' : 'default'}>
                  {codigo.usado ? 'Usado' : 'Disponível'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground text-xs">Data de Uso</label>
            {codigo.dataUso ? (
              <p className="text-sm">
                {new Date(codigo.dataUso).toLocaleString('pt-BR')}
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">
                Ainda não foi utilizado
              </p>
            )}
          </div>

          {!codigo.ativo && (
            <div className="rounded-md bg-red-50 p-3 text-sm dark:bg-red-950">
              <p className="text-red-900 dark:text-red-100">
                <strong>Código Revogado:</strong> Este código não pode mais ser
                utilizado para ativar dispositivos. Esta ação é permanente e não
                pode ser desfeita.
              </p>
            </div>
          )}

          {codigo.usado && codigo.deviceId && (
            <div className="rounded-md bg-blue-50 p-3 text-sm dark:bg-blue-950">
              <p className="text-blue-900 dark:text-blue-100">
                <strong>Código Utilizado:</strong> Este código já foi usado para
                ativar um dispositivo e não pode ser reutilizado.
              </p>
            </div>
          )}

          {!(codigo.usado || codigo.ativo) && (
            <div className="rounded-md bg-amber-50 p-3 text-sm dark:bg-amber-950">
              <p className="text-amber-900 dark:text-amber-100">
                <strong>Atenção:</strong> Este código foi revogado antes de ser
                utilizado.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
