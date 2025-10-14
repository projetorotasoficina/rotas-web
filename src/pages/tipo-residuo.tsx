import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { PageLoading } from '@/components/layout/page-loading'
import { TipoResiduoModal } from '@/components/tipo-residuo/tipo-residuo-modal'
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
import { DataTable } from '@/components/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { TipoResiduo } from '@/http/tipo-residuo/types'
import { useDeleteTipoResiduo } from '@/http/tipo-residuo/use-delete-tipo-residuo'
import { useListTipoResiduo } from '@/http/tipo-residuo/use-list-tipo-residuo'

export function TipoResiduoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTipoResiduo, setEditingTipoResiduo] =
    useState<TipoResiduo | null>(null)
  const [deletingTipoResiduo, setDeletingTipoResiduo] =
    useState<TipoResiduo | null>(null)

  const { data: tiposResiduo = [], isLoading } = useListTipoResiduo()
  const deleteMutation = useDeleteTipoResiduo()

  const handleEdit = (tipoResiduo: TipoResiduo) => {
    setEditingTipoResiduo(tipoResiduo)
    setIsModalOpen(true)
  }

  const handleDelete = (tipoResiduo: TipoResiduo) => {
    setDeletingTipoResiduo(tipoResiduo)
  }

  const confirmDelete = () => {
    if (deletingTipoResiduo?.id) {
      deleteMutation.mutate(deletingTipoResiduo.id)
      setDeletingTipoResiduo(null)
    }
  }

  const handleAdd = () => {
    setEditingTipoResiduo(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTipoResiduo(null)
  }

  const columns: ColumnDef<TipoResiduo>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => {
        return (
          <div className="-mx-2">
            <Button
              className="h-auto px-2 py-2 hover:bg-transparent"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              variant="ghost"
            >
              ID
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'nome',
      header: ({ column }) => {
        return (
          <div className="-mx-2">
            <Button
              className="h-auto px-2 py-2 hover:bg-transparent"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              variant="ghost"
            >
              Nome
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'corHex',
      header: 'Cor',
      cell: ({ row }) => {
        const cor = row.getValue('corHex') as string
        return (
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded border"
              style={{ backgroundColor: cor }}
              title={cor}
            />
            <span className="font-mono text-sm">{cor}</span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        const tipoResiduo = row.original

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8 p-0" variant="ghost">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(tipoResiduo)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(tipoResiduo)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  if (isLoading) {
    return <PageLoading />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Tipos de Resíduo</h1>
      </div>

      <DataTable
        columns={columns}
        data={tiposResiduo}
        filterColumn="nome"
        filterPlaceholder="Filtrar por nome..."
        toolbar={
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        }
      />

      <TipoResiduoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tipoResiduo={editingTipoResiduo}
      />

      <AlertDialog
        onOpenChange={(open) => !open && setDeletingTipoResiduo(null)}
        open={!!deletingTipoResiduo}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o tipo de resíduo{' '}
              <strong>{deletingTipoResiduo?.nome}</strong>? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
