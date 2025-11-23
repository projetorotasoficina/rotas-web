/**
 * @file Página de Gerenciamento de Tipos de Resíduo.
 * @description Este arquivo define o componente `TipoResiduoPage`, que renderiza a interface
 * para gerenciar os tipos de resíduo (ex: Plástico, Vidro, Metal), incluindo uma cor
 * associada a cada tipo. A página implementa uma funcionalidade completa de CRUD.
 *
 * Funcionalidades Principais:
 * - **Listagem e Paginação**: Exibe os tipos de resíduo em uma `DataTable` com
 *   suporte a paginação, ordenação e busca do lado do servidor.
 * - **Criação e Edição**: Utiliza um modal (`TipoResiduoModal`) para adicionar ou editar
 *   tipos de resíduo.
 * - **Exclusão**: Apresenta um `AlertDialog` para confirmação antes de excluir um item.
 * - **Controle de Acesso**: As ações são controladas pelo hook `useRole`.
 * - **Busca com Debounce**: Otimiza a busca usando o hook `useDebounce`.
 */
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
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
import { useDebounce } from '@/hooks/use-debounce'
import { useRole } from '@/hooks/use-role'
import type { TipoResiduo } from '@/http/tipo-residuo/types'
import { useDeleteTipoResiduo } from '@/http/tipo-residuo/use-delete-tipo-residuo'
import { usePaginatedTipoResiduo } from '@/http/tipo-residuo/use-paginated-tipo-residuo'

/**
 * @description Componente que renderiza a página de gerenciamento de Tipos de Resíduo.
 */
export function TipoResiduoPage() {
  const { canEdit, canDelete, canCreate } = useRole()
  // Estados para controlar a abertura de modais e os dados em edição/exclusão.
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTipoResiduo, setEditingTipoResiduo] =
    useState<TipoResiduo | null>(null)
  const [deletingTipoResiduo, setDeletingTipoResiduo] =
    useState<TipoResiduo | null>(null)

  // Estados para controle da tabela (paginação, ordenação, filtro).
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchFilter, setSearchFilter] = useState('')
  const debouncedSearch = useDebounce(searchFilter, 500)

  // Hook para buscar os dados paginados da API.
  const {
    data: response,
    isLoading,
    isFetching,
  } = usePaginatedTipoResiduo({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    order: sorting[0]?.id,
    asc: sorting[0]?.desc === false,
    search: debouncedSearch,
  })

  const tiposResiduo = response?.content ?? []
  // Hook de mutação para excluir um tipo de resíduo.
  const deleteMutation = useDeleteTipoResiduo()

  /**
   * @description Abre o modal de edição com os dados do item selecionado.
   * @param {TipoResiduo} tipoResiduo - O item a ser editado.
   */
  const handleEdit = (tipoResiduo: TipoResiduo) => {
    setEditingTipoResiduo(tipoResiduo)
    setIsModalOpen(true)
  }

  /**
   * @description Define o item a ser excluído e abre o diálogo de confirmação.
   * @param {TipoResiduo} tipoResiduo - O item a ser excluído.
   */
  const handleDelete = (tipoResiduo: TipoResiduo) => {
    setDeletingTipoResiduo(tipoResiduo)
  }

  /**
   * @description Confirma e executa a exclusão do item.
   */
  const confirmDelete = () => {
    if (deletingTipoResiduo?.id) {
      deleteMutation.mutate(deletingTipoResiduo.id)
      setDeletingTipoResiduo(null)
    }
  }

  /**
   * @description Abre o modal para adicionar um novo item.
   */
  const handleAdd = () => {
    setEditingTipoResiduo(null)
    setIsModalOpen(true)
  }

  /**
   * @description Fecha o modal de adição/edição e limpa o estado.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTipoResiduo(null)
  }

  // Definição das colunas para a DataTable.
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
                <DropdownMenuItem
                  disabled={!canEdit()}
                  onClick={() => handleEdit(tipoResiduo)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!canDelete()}
                  onClick={() => handleDelete(tipoResiduo)}
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
        <h1 className="font-bold text-2xl">Tipos de Resíduo</h1>
      </div>

      <DataTable
        columns={columns}
        data={tiposResiduo}
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
