import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import {
  ArrowUpDown,
  Copy,
  Eye,
  MoreHorizontal,
  Plus,
  ShieldOff,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { CodigoAtivacaoDetailsModal } from '@/components/codigos-ativacao/codigo-ativacao-details-modal'
import { CodigoGeradoModal } from '@/components/codigos-ativacao/codigo-gerado-modal'
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDebounce } from '@/hooks/use-debounce'
import { useRole } from '@/hooks/use-role'
import type { CodigoAtivacao } from '@/http/codigos-ativacao/types'
import { useDeleteCodigoAtivacao } from '@/http/codigos-ativacao/use-delete-codigo-ativacao'
import { useGerarCodigoAtivacao } from '@/http/codigos-ativacao/use-gerar-codigo-ativacao'
import { usePaginatedCodigosAtivacao } from '@/http/codigos-ativacao/use-paginated-codigos-ativacao'
import { useRevogarCodigoAtivacao } from '@/http/codigos-ativacao/use-revogar-codigo-ativacao'

export function CodigosAtivacaoTable() {
  const { canEdit, canDelete, canCreate } = useRole()
  const [deletingCodigo, setDeletingCodigo] = useState<CodigoAtivacao | null>(
    null
  )
  const [revokingCodigo, setRevokingCodigo] = useState<CodigoAtivacao | null>(
    null
  )
  const [viewingCodigo, setViewingCodigo] = useState<CodigoAtivacao | null>(
    null
  )
  const [isCodigoGeradoModalOpen, setIsCodigoGeradoModalOpen] = useState(false)
  const [codigoGerado, setCodigoGerado] = useState<{
    codigo: string
    dataGeracao: string
    id?: number
  } | null>(null)

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
  } = usePaginatedCodigosAtivacao({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    order: sorting[0]?.id,
    asc: sorting[0]?.desc === false,
    search: debouncedSearch,
  })

  const codigos = response?.content ?? []
  const deleteMutation = useDeleteCodigoAtivacao()
  const gerarMutation = useGerarCodigoAtivacao()
  const revogarMutation = useRevogarCodigoAtivacao()

  const handleViewDetails = (codigo: CodigoAtivacao) => {
    setViewingCodigo(codigo)
  }

  const handleRevogar = (codigo: CodigoAtivacao) => {
    setRevokingCodigo(codigo)
  }

  const confirmRevogar = () => {
    if (revokingCodigo) {
      revogarMutation.mutate(revokingCodigo)
      setRevokingCodigo(null)
    }
  }

  const handleDelete = (codigo: CodigoAtivacao) => {
    setDeletingCodigo(codigo)
  }

  const confirmDelete = () => {
    if (deletingCodigo?.id) {
      deleteMutation.mutate(deletingCodigo.id)
      setDeletingCodigo(null)
    }
  }

  const handleGerar = () => {
    gerarMutation.mutate(undefined, {
      onSuccess: (data) => {
        const codigoCompleto = codigos.find((c) => c.codigo === data.codigo)

        setCodigoGerado({
          codigo: data.codigo,
          dataGeracao: data.dataGeracao,
          id: codigoCompleto?.id,
        })
        setIsCodigoGeradoModalOpen(true)
      },
    })
  }

  const handleDeleteCodigoGerado = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setIsCodigoGeradoModalOpen(false)
        setCodigoGerado(null)
      },
    })
  }

  const handleCloseCodigoGeradoModal = () => {
    setIsCodigoGeradoModalOpen(false)
    setCodigoGerado(null)
  }

  const handleCopyCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo)
    toast.success('Código copiado para área de transferência!')
  }

  const columns: ColumnDef<CodigoAtivacao>[] = [
    {
      accessorKey: 'codigo',
      header: 'Código',
      cell: ({ row }) => {
        const codigo = row.getValue('codigo') as string
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-lg">{codigo}</span>
            <Button
              className="h-6 w-6 p-0"
              onClick={() => handleCopyCodigo(codigo)}
              size="sm"
              variant="ghost"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'dataGeracao',
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
              Data de Geração
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const data = row.getValue('dataGeracao') as string
        return new Date(data).toLocaleString('pt-BR')
      },
    },
    {
      accessorKey: 'usado',
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
              Status de Uso
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const usado = row.getValue('usado') as boolean
        return (
          <Badge variant={usado ? 'secondary' : 'default'}>
            {usado ? 'Usado' : 'Disponível'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'dataUso',
      header: 'Data de Uso',
      cell: ({ row }) => {
        const data = row.getValue('dataUso') as string | null
        if (!data) {
          return '-'
        }
        return new Date(data).toLocaleString('pt-BR')
      },
    },
    {
      accessorKey: 'deviceId',
      header: 'Device ID',
      cell: ({ row }) => {
        const deviceId = row.getValue('deviceId') as string | null
        if (!deviceId) {
          return '-'
        }
        return (
          <span className="font-mono text-xs" title={deviceId}>
            {deviceId.substring(0, 12)}...
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
          <Badge variant={ativo ? 'default' : 'destructive'}>
            {ativo ? 'Ativo' : 'Revogado'}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        const codigo = row.original

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
                <DropdownMenuItem onClick={() => handleViewDetails(codigo)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={!(canEdit() && codigo.ativo)}
                  onClick={() => handleRevogar(codigo)}
                >
                  <ShieldOff className="mr-2 h-4 w-4" />
                  Revogar Código
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!canDelete()}
                  onClick={() => handleDelete(codigo)}
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
    <>
      <DataTable
        columns={columns}
        data={codigos}
        filterColumn="codigo"
        filterPlaceholder="Filtrar por código..."
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
          <Button
            disabled={!canCreate() || gerarMutation.isPending}
            onClick={handleGerar}
          >
            <Plus className="h-4 w-4" />
            {gerarMutation.isPending ? 'Gerando...' : 'Gerar Código'}
          </Button>
        }
      />

      {codigoGerado && (
        <CodigoGeradoModal
          codigo={codigoGerado.codigo}
          codigoId={codigoGerado.id}
          dataGeracao={codigoGerado.dataGeracao}
          isOpen={isCodigoGeradoModalOpen}
          onClose={handleCloseCodigoGeradoModal}
          onDelete={handleDeleteCodigoGerado}
        />
      )}

      <AlertDialog
        onOpenChange={(open) => !open && setDeletingCodigo(null)}
        open={!!deletingCodigo}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o código{' '}
              <strong className="font-mono">{deletingCodigo?.codigo}</strong>?
              Esta ação não pode ser desfeita.
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

      <AlertDialog
        onOpenChange={(open) => !open && setRevokingCodigo(null)}
        open={!!revokingCodigo}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Revogação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja revogar o código{' '}
              <strong className="font-mono">{revokingCodigo?.codigo}</strong>?
              Esta ação é <strong>permanente</strong> e não poderá ser desfeita.
              O código não poderá mais ser utilizado para ativar dispositivos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-orange-600 hover:bg-orange-700"
              onClick={confirmRevogar}
            >
              Revogar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CodigoAtivacaoDetailsModal
        codigo={viewingCodigo}
        isOpen={!!viewingCodigo}
        onClose={() => setViewingCodigo(null)}
      />
    </>
  )
}
