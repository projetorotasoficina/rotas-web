import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { RotaModal } from '@/components/rotas/rota-modal'
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
import type {
  DiaSemana,
  FrequenciaRota,
  Periodo,
  Rota,
} from '@/http/rotas/types'
import { useDeleteRota } from '@/http/rotas/use-delete-rota'
import { usePaginatedRotas } from '@/http/rotas/use-paginated-rotas'
import { useListTipoColeta } from '@/http/tipo-coleta/use-list-tipo-coleta'
import { useListTipoResiduo } from '@/http/tipo-residuo/use-list-tipo-residuo'

const DIAS_SEMANA_DISPLAY: Record<DiaSemana, string> = {
  SEGUNDA: 'Segunda',
  TERCA: 'Terça',
  QUARTA: 'Quarta',
  QUINTA: 'Quinta',
  SEXTA: 'Sexta',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
}

const PERIODOS_DISPLAY: Record<Periodo, string> = {
  MANHA: 'Manhã',
  TARDE: 'Tarde',
  NOITE: 'Noite',
}

const formatFrequencias = (frequencias: FrequenciaRota[]) => {
  // Lógica defensiva para evitar crash com dados corrompidos do backend
  if (!Array.isArray(frequencias)) {
    return '-'
  }

  const parts = frequencias
    .filter((f) => f && typeof f === 'object') // Garante que f é um objeto não nulo
    .map((f) => {
      if (!(f.diaSemana && f.periodo)) {
        return null // Ignora objetos com propriedades faltando
      }
      const dia = DIAS_SEMANA_DISPLAY[f.diaSemana] || f.diaSemana
      const periodo = PERIODOS_DISPLAY[f.periodo] || f.periodo
      return `${dia} (${periodo})`
    })
    .filter((p) => p) // Remove as entradas nulas

  if (parts.length === 0) {
    return '-'
  }

  return parts.join(', ')
}

export default function RotasPage() {
  const { canEdit, canDelete, canCreate } = useRole()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRota, setEditingRota] = useState<Rota | null>(null)
  const [deletingRota, setDeletingRota] = useState<Rota | null>(null)

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
  } = usePaginatedRotas({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    order: sorting[0]?.id,
    asc: sorting[0]?.desc === false,
    search: debouncedSearch,
  })

  const rotas = response?.content ?? []
  const { data: tiposResiduo = [] } = useListTipoResiduo()
  const { data: tiposColeta = [] } = useListTipoColeta()
  const deleteMutation = useDeleteRota()

  const handleEdit = (rota: Rota) => {
    setEditingRota(rota)
    setIsModalOpen(true)
  }

  const handleDelete = (rota: Rota) => {
    setDeletingRota(rota)
  }

  const confirmDelete = () => {
    if (deletingRota?.id) {
      deleteMutation.mutate(deletingRota.id)
      setDeletingRota(null)
    }
  }

  const handleAdd = () => {
    setEditingRota(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingRota(null)
  }

  // Helper functions to get names
  const getTipoResiduoNome = (id: number) => {
    const tipo = tiposResiduo.find((t) => t.id === id)
    return tipo?.nome || '-'
  }

  const getTipoColetaNome = (id: number) => {
    const tipo = tiposColeta.find((t) => t.id === id)
    return tipo?.nome || '-'
  }

  const columns: ColumnDef<Rota>[] = [
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
      accessorKey: 'tipoResiduoId',
      header: 'Tipo de Resíduo',
      cell: ({ row }) => {
        const id = row.getValue('tipoResiduoId') as number
        return getTipoResiduoNome(id)
      },
    },
    {
      accessorKey: 'tipoColetaId',
      header: 'Tipo de Coleta',
      cell: ({ row }) => {
        const id = row.getValue('tipoColetaId') as number
        return getTipoColetaNome(id)
      },
    },
    {
      accessorKey: 'frequencias',
      header: 'Frequência',
      cell: ({ row }) => {
        const frequencias = row.original.frequencias
        const formatted = formatFrequencias(frequencias || [])
        return (
          <span className="max-w-[200px] truncate" title={formatted}>
            {formatted}
          </span>
        )
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
            {ativo ? 'Ativa' : 'Inativa'}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        const rota = row.original

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
                  onClick={() => handleEdit(rota)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!canDelete()}
                  onClick={() => handleDelete(rota)}
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
        <h1 className="font-bold text-2xl">Rotas</h1>
      </div>

      <DataTable
        columns={columns}
        data={rotas}
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

      <RotaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        rota={editingRota}
      />

      <AlertDialog
        onOpenChange={(open) => !open && setDeletingRota(null)}
        open={!!deletingRota}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a rota{' '}
              <strong>{deletingRota?.nome}</strong>? Esta ação não pode ser
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
