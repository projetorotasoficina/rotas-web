import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { CaminhaoModal } from '@/components/caminhoes/caminhao-modal'
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
import type { Caminhao } from '@/http/caminhoes/types'
import { useDeleteCaminhao } from '@/http/caminhoes/use-delete-caminhao'
import { usePaginatedCaminhoes } from '@/http/caminhoes/use-paginated-caminhoes'
import { useListTipoColeta } from '@/http/tipo-coleta/use-list-tipo-coleta'
import { useListTipoResiduo } from '@/http/tipo-residuo/use-list-tipo-residuo'

export default function CaminhoesPage() {
  const { canEdit, canDelete, canCreate } = useRole()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCaminhao, setEditingCaminhao] = useState<Caminhao | null>(null)
  const [deletingCaminhao, setDeletingCaminhao] = useState<Caminhao | null>(
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
  } = usePaginatedCaminhoes({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    order: sorting[0]?.id,
    asc: sorting[0]?.desc === false,
    search: debouncedSearch,
  })

  const caminhoes = response?.content ?? []
  const { data: tiposColeta = [] } = useListTipoColeta()
  const { data: tiposResiduo = [] } = useListTipoResiduo()
  const deleteMutation = useDeleteCaminhao()

  const handleEdit = (caminhao: Caminhao) => {
    setEditingCaminhao(caminhao)
    setIsModalOpen(true)
  }

  const handleDelete = (caminhao: Caminhao) => {
    setDeletingCaminhao(caminhao)
  }

  const confirmDelete = () => {
    if (deletingCaminhao?.id) {
      deleteMutation.mutate(deletingCaminhao.id)
      setDeletingCaminhao(null)
    }
  }

  const handleAdd = () => {
    setEditingCaminhao(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCaminhao(null)
  }

  const columns: ColumnDef<Caminhao>[] = [
    {
      accessorKey: 'modelo',
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
              Modelo
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'placa',
      header: 'Placa',
    },
    {
      accessorKey: 'tipoVeiculo',
      header: 'Tipo de Veículo',
      cell: ({ row }) => {
        const tipoVeiculo = row.getValue('tipoVeiculo') as string
        const tiposVeiculo: Record<string, string> = {
          VUC: 'VUC (CNH B)',
          CAMINHAO_LEVE: 'Caminhão Leve (CNH C)',
          CAMINHAO_MEDIO: 'Caminhão Médio (CNH C)',
          CAMINHAO_PESADO: 'Caminhão Pesado (CNH C)',
          CAMINHAO_CARRETA: 'Caminhão Carreta (CNH E)',
        }
        return tiposVeiculo[tipoVeiculo] || tipoVeiculo
      },
    },
    {
      accessorKey: 'tipoColetaId',
      header: 'Tipo de Coleta',
      cell: ({ row }) => {
        const tipoColetaId = row.getValue('tipoColetaId') as number
        const tipoColeta = tiposColeta.find((tipo) => tipo.id === tipoColetaId)
        return tipoColeta ? tipoColeta.nome : '-'
      },
    },
    {
      accessorKey: 'residuoId',
      header: 'Tipo de Resíduo',
      cell: ({ row }) => {
        const residuoId = row.getValue('residuoId') as number
        const tipoResiduo = tiposResiduo.find((tipo) => tipo.id === residuoId)
        return tipoResiduo ? tipoResiduo.nome : '-'
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
        const caminhao = row.original

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
                  onClick={() => handleEdit(caminhao)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!canDelete()}
                  onClick={() => handleDelete(caminhao)}
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
        <h1 className="font-bold text-2xl">Caminhões</h1>
      </div>

      <DataTable
        columns={columns}
        data={caminhoes}
        filterPlaceholder="Filtrar por modelo ou placa..."
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

      <CaminhaoModal
        caminhao={editingCaminhao}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <AlertDialog
        onOpenChange={(open) => !open && setDeletingCaminhao(null)}
        open={!!deletingCaminhao}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o caminhão{' '}
              <strong>{deletingCaminhao?.modelo}</strong>? Esta ação não pode
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
