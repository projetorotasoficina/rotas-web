import { Copy, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type CodigoGeradoModalProps = {
  isOpen: boolean
  onClose: () => void
  codigo: string
  dataGeracao: string
  codigoId?: number
  onDelete?: (id: number) => void
}

export function CodigoGeradoModal({
  isOpen,
  onClose,
  codigo,
  dataGeracao,
  codigoId,
  onDelete,
}: CodigoGeradoModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(codigo)
    toast.success('Código copiado para área de transferência!')
  }

  const handleDelete = () => {
    if (codigoId && onDelete) {
      onDelete(codigoId)
      setShowDeleteConfirm(false)
      onClose()
    }
  }

  const handleClose = () => {
    onClose()
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <Dialog onOpenChange={handleClose} open={isOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Código de Ativação Gerado</DialogTitle>
            <DialogDescription>
              Compartilhe este código com o motorista para ativar o aplicativo
              Android.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border bg-muted p-6 text-center">
              <p className="mb-2 text-muted-foreground text-sm">
                Código de Ativação
              </p>
              <p className="font-bold font-mono text-4xl tracking-wider">
                {codigo}
              </p>
            </div>

            <div className="text-center text-muted-foreground text-sm">
              Gerado em: {new Date(dataGeracao).toLocaleString('pt-BR')}
            </div>

            <div className="rounded-md bg-blue-50 p-3 text-sm dark:bg-blue-950">
              <p className="text-blue-900 dark:text-blue-100">
                <strong>Importante:</strong> Este código pode ser usado apenas
                uma vez. Após a ativação, ele será marcado como utilizado.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              className="gap-2"
              onClick={() => setShowDeleteConfirm(true)}
              type="button"
              variant="outline"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
            <Button className="gap-2" onClick={handleCopy} type="button">
              <Copy className="h-4 w-4" />
              Copiar Código
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog onOpenChange={setShowDeleteConfirm} open={showDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Código?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o código{' '}
              <strong className="font-mono">{codigo}</strong>? Esta ação não
              pode ser desfeita e o código não poderá mais ser usado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
