import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { MotoristaModal } from '@/components/motoristas/motorista-modal'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDebounce } from '@/hooks/use-debounce'
import { useRole } from '@/hooks/use-role'
import type { Motorista } from '@/http/motoristas/types'
import { useDeleteMotorista } from '@/http/motoristas/use-delete-motorista'
import { usePaginatedMotoristas } from '@/http/motoristas/use-paginated-motoristas'
import { displayCPF } from '@/lib/masks'

export function MotoristasPage() {
  const { canEdit, canDelete, canCreate } = useRole()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMotorista, setEditingMotorista] = useState<Motorista | null>(
    null
  )
  const [deletingMotorista, setDeletingMotorista] = useState<Motorista | null>(
    null
  )

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchFilter, setSearchFilter] = useState('')
  const debouncedSearch = useDebounce(searchFilter, 500)

  const {
    data: response,
    isLoading,
    isFetching,
  } = usePaginatedMotoristas({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    order: sorting[0]?.id,
    asc: sorting[0]?.desc === false,
    search: debouncedSearch,
  })

  const motoristas = response?.content ?? []
  const deleteMutation = useDeleteMotorista()

  const handleEdit = (motorista: Motorista) => {
    setEditingMotorista(motorista)
    setIsModalOpen(true)
  }

  const handleDelete = (motorista: Motorista) => {
    setDeletingMotorista(motorista)
  }

  const confirmDelete = () => {
    if (deletingMotorista?.id) {
      deleteMutation.mutate(deletingMotorista.id)
      setDeletingMotorista(null)
    }
  }

  const handleAdd = () => {
    setEditingMotorista(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingMotorista(null)
  }

  const columns: ColumnDef<Motorista>[] = [
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
      accessorKey: 'cpf',
      header: 'CPF',
      cell: ({ row }) => {
        const cpf = row.getValue('cpf') as string
        return displayCPF(cpf)
      },
    },
    {
      accessorKey: 'cnhCategoria',
      header: 'Categoria CNH',
      cell: ({ row }) => {
        const cnh = row.getValue('cnhCategoria') as string
        return cnh || '-'
      },
    },
    {
      accessorKey: 'cnhValidade',
      header: 'Validade CNH',
      cell: ({ row }) => {
        const validade = row.getValue('cnhValidade') as string
        if (!validade) {
          return '-'
        }
        const date = new Date(validade)
        return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
      },
    },
    {
      accessorKey: 'ativo',
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
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const ativo = row.getValue('ativo') as boolean
        return (
          <Badge variant={ativo ? 'default' : 'secondary'}>
            {ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        const motorista = row.original

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
                <DropdownMenuItem
                  disabled={!canEdit()}
                  onClick={() => handleEdit(motorista)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!canDelete()}
                  onClick={() => handleDelete(motorista)}
                >
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Motoristas</h1>
      </div>

      <DataTable
        columns={columns}
        data={motoristas}
        filterColumn="nome"
        filterPlaceholder="Filtrar por nome..."
        isLoading={isLoading || isFetching}
        onFilterChange={setSearchFilter}
        onSortingChange={setSorting}
        serverSidePagination={{
          pageCount: response?.totalPages ?? 0,
          totalElements: response?.totalElements ?? 0,
          pagination,
          onPaginationChange: setPagination,
        }}
        sorting={sorting}
        toolbar={
          <Button disabled={!canCreate()} onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        }
      />

      <MotoristaModal
        isOpen={isModalOpen}
        motorista={editingMotorista}
        onClose={handleCloseModal}
      />

      <AlertDialog
        onOpenChange={(open) => !open && setDeletingMotorista(null)}
        open={!!deletingMotorista}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o motorista{' '}
              <strong>{deletingMotorista?.nome}</strong>? Esta ação não pode ser
              desfeita.
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
