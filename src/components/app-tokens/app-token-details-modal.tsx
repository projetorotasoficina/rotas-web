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
import type { AppToken } from '@/http/app-tokens/types'

type AppTokenDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  token: AppToken | null
}

export function AppTokenDetailsModal({
  isOpen,
  onClose,
  token,
}: AppTokenDetailsModalProps) {
  if (!token) {
    return null
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copiado para área de transferência!`)
  }

  const getDaysSinceLastAccess = () => {
    if (!token.ultimoAcesso) {
      return null
    }
    const lastAccess = new Date(token.ultimoAcesso)
    const now = new Date()
    const diffDays = Math.floor(
      (now.getTime() - lastAccess.getTime()) / (1000 * 60 * 60 * 24)
    )
    return diffDays
  }

  const daysSinceLastAccess = getDaysSinceLastAccess()

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Token</DialogTitle>
          <DialogDescription>
            Informações completas sobre o token de acesso do dispositivo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="font-medium text-sm">Status</span>
            <Badge variant={token.ativo ? 'default' : 'destructive'}>
              {token.ativo ? 'Ativo' : 'Revogado'}
            </Badge>
          </div>

          <div className="space-y-2">
            <label className="font-medium text-sm">Device ID</label>
            <div className="flex items-center gap-2 rounded-md border bg-muted p-3">
              <code className="flex-1 font-mono text-xs">{token.deviceId}</code>
              <Button
                className="h-7 w-7 p-0"
                onClick={() => handleCopy(token.deviceId, 'Device ID')}
                size="sm"
                variant="ghost"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-medium text-sm">Token de Acesso</label>
            <div className="flex items-center gap-2 rounded-md border bg-muted p-3">
              <code className="flex-1 break-all font-mono text-xs">
                {token.token}
              </code>
              <Button
                className="h-7 w-7 shrink-0 p-0"
                onClick={() => handleCopy(token.token, 'Token')}
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
                Data de Criação
              </label>
              <p className="text-sm">
                {new Date(token.dataCriacao).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">
                Total de Acessos
              </label>
              <p className="font-semibold text-sm">
                {token.totalAcessos.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground text-xs">
              Último Acesso
            </label>
            {token.ultimoAcesso ? (
              <div className="flex items-center gap-2">
                <p className="text-sm">
                  {new Date(token.ultimoAcesso).toLocaleString('pt-BR')}
                </p>
                {daysSinceLastAccess !== null && daysSinceLastAccess > 30 && (
                  <Badge variant="outline">
                    Inativo há {daysSinceLastAccess} dias
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Nunca acessou a API
              </p>
            )}
          </div>

          {!token.ativo && (
            <div className="rounded-md bg-red-50 p-3 text-sm dark:bg-red-950">
              <p className="text-red-900 dark:text-red-100">
                <strong>Token Revogado:</strong> Este dispositivo não pode mais
                acessar a API. Esta ação é permanente e não pode ser desfeita.
              </p>
            </div>
          )}

          {daysSinceLastAccess !== null && daysSinceLastAccess > 60 && (
            <div className="rounded-md bg-amber-50 p-3 text-sm dark:bg-amber-950">
              <p className="text-amber-900 dark:text-amber-100">
                <strong>Atenção:</strong> Este dispositivo está inativo há mais
                de 60 dias. Considere revogar o token se não for mais
                necessário.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
