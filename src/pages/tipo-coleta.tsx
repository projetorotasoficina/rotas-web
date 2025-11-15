/**
 * @file Página de Gerenciamento de Tipos de Coleta.
 * @description Este arquivo define o componente `TipoColetaPage`, que renderiza a interface
 * para gerenciar os tipos de coleta (ex: Coleta Seletiva, Coleta Orgânica). A página
 * implementa uma funcionalidade completa de CRUD (Criar, Ler, Atualizar, Excluir).
 *
 * Funcionalidades Principais:
 * - **Listagem e Paginação**: Exibe os tipos de coleta em uma `DataTable` com
 *   suporte a paginação, ordenação e busca do lado do servidor.
 * - **Criação e Edição**: Utiliza um modal (`TipoColetaModal`) para adicionar ou editar
 *   tipos de coleta.
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
import { TipoColetaModal } from '@/components/tipo-coleta/tipo-coleta-modal'
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
import type { TipoColeta } from '@/http/tipo-coleta/types'
import { useDeleteTipoColeta } from '@/http/tipo-coleta/use-delete-tipo-coleta'
import { usePaginatedTipoColeta } from '@/http/tipo-coleta/use-paginated-tipo-coleta'

/**
 * @description Componente que renderiza a página de gerenciamento de Tipos de Coleta.
 */
export function TipoColetaPage() {
  const { canEdit, canDelete, canCreate } = useRole()
  // Estados para controlar a abertura de modais e os dados em edição/exclusão.
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTipoColeta, setEditingTipoColeta] = useState<TipoColeta | null>(
    null
  )
  const [deletingTipoColeta, setDeletingTipoColeta] =
    useState<TipoColeta | null>(null)

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
  } = usePaginatedTipoColeta({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    order: sorting[0]?.id,
    asc: sorting[0]?.desc === false,
    search: debouncedSearch,
  })

  const tiposColeta = response?.content ?? []
  // Hook de mutação para excluir um tipo de coleta.
  const deleteMutation = useDeleteTipoColeta()

  /**
   * @description Abre o modal de edição com os dados do item selecionado.
   * @param {TipoColeta} tipoColeta - O item a ser editado.
   */
  const handleEdit = (tipoColeta: TipoColeta) => {
    setEditingTipoColeta(tipoColeta)
    setIsModalOpen(true)
  }

  /**
   * @description Define o item a ser excluído e abre o diálogo de confirmação.
   * @param {TipoColeta} tipoColeta - O item a ser excluído.
   */
  const handleDelete = (tipoColeta: TipoColeta) => {
    setDeletingTipoColeta(tipoColeta)
  }

  /**
   * @description Confirma e executa a exclusão do item.
   */
  const confirmDelete = () => {
    if (deletingTipoColeta?.id) {
      deleteMutation.mutate(deletingTipoColeta.id)
      setDeletingTipoColeta(null)
    }
  }

  /**
   * @description Abre o modal para adicionar um novo item.
   */
  const handleAdd = () => {
    setEditingTipoColeta(null)
    setIsModalOpen(true)
  }

  /**
   * @description Fecha o modal de adição/edição e limpa o estado.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTipoColeta(null)
  }

  // Definição das colunas para a DataTable.
  const columns: ColumnDef<TipoColeta>[] = [
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
      id: 'actions',
      enableHiding: false,
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        const tipoColeta = row.original

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
                  onClick={() => handleEdit(tipoColeta)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!canDelete()}
                  onClick={() => handleDelete(tipoColeta)}
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
        <h1 className="font-bold text-2xl">Tipos de Coleta</h1>
      </div>

      <DataTable
        columns={columns}
        data={tiposColeta}
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

      <TipoColetaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tipoColeta={editingTipoColeta}
      />

      <AlertDialog
        onOpenChange={(open) => !open && setDeletingTipoColeta(null)}
        open={!!deletingTipoColeta}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o tipo de coleta{' '}
              <strong>{deletingTipoColeta?.nome}</strong>? Esta ação não pode
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
