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
  ShieldOff,
  Trash2,
} from 'lucide-react'
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
import type { AppToken } from '@/http/app-tokens/types'
import { useDeleteAppToken } from '@/http/app-tokens/use-delete-app-token'
import { usePaginatedAppTokens } from '@/http/app-tokens/use-paginated-app-tokens'
import { useRevogarAppToken } from '@/http/app-tokens/use-revogar-app-token'

type AppTokensTableProps = {
  onViewDetails?: (token: AppToken) => void
}

export function AppTokensTable({ onViewDetails }: AppTokensTableProps) {
  const { canEdit, canDelete } = useRole()
  const [deletingToken, setDeletingToken] = useState<AppToken | null>(null)
  const [revokingToken, setRevokingToken] = useState<AppToken | null>(null)

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
  } = usePaginatedAppTokens({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    order: sorting[0]?.id,
    asc: sorting[0]?.desc === false,
    search: debouncedSearch,
  })

  const tokens = response?.content ?? []
  const deleteMutation = useDeleteAppToken()
  const revogarMutation = useRevogarAppToken()

  const handleDelete = (token: AppToken) => {
    setDeletingToken(token)
  }

  const confirmDelete = () => {
    if (deletingToken?.id) {
      deleteMutation.mutate(deletingToken.id)
      setDeletingToken(null)
    }
  }

  const handleRevogar = (token: AppToken) => {
    setRevokingToken(token)
  }

  const confirmRevogar = () => {
    if (revokingToken?.id) {
      revogarMutation.mutate(revokingToken.id)
      setRevokingToken(null)
    }
  }

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    toast.success('Token copiado para área de transferência!')
  }

  const handleCopyDeviceId = (deviceId: string) => {
    navigator.clipboard.writeText(deviceId)
    toast.success('Device ID copiado para área de transferência!')
  }

  const maskToken = (token: string) => {
    if (token.length <= 12) {
      return token
    }
    return `${token.substring(0, 8)}...${token.substring(token.length - 4)}`
  }

  const columns: ColumnDef<AppToken>[] = [
    {
      accessorKey: 'deviceId',
      header: 'Device ID',
      cell: ({ row }) => {
        const deviceId = row.getValue('deviceId') as string
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs" title={deviceId}>
              {deviceId.substring(0, 16)}...
            </span>
            <Button
              className="h-6 w-6 p-0"
              onClick={() => handleCopyDeviceId(deviceId)}
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
      accessorKey: 'token',
      header: 'Token',
      cell: ({ row }) => {
        const token = row.getValue('token') as string
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs" title={token}>
              {maskToken(token)}
            </span>
            <Button
              className="h-6 w-6 p-0"
              onClick={() => handleCopyToken(token)}
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
      accessorKey: 'dataCriacao',
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
              Data de Criação
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const data = row.getValue('dataCriacao') as string
        return new Date(data).toLocaleString('pt-BR')
      },
    },
    {
      accessorKey: 'ultimoAcesso',
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
              Último Acesso
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const data = row.getValue('ultimoAcesso') as string | null
        if (!data) {
          return <span className="text-muted-foreground text-sm">Nunca</span>
        }
        const date = new Date(data)
        const now = new Date()
        const diffDays = Math.floor(
          (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        )

        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">{date.toLocaleString('pt-BR')}</span>
            {diffDays > 30 && (
              <Badge variant="outline">Inativo {diffDays}d</Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'totalAcessos',
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
              Acessos
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const total = row.getValue('totalAcessos') as number
        return <span className="font-medium">{total.toLocaleString()}</span>
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
        const token = row.original

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
                <DropdownMenuItem onClick={() => onViewDetails?.(token)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={!(canEdit() && token.ativo)}
                  onClick={() => handleRevogar(token)}
                >
                  <ShieldOff className="mr-2 h-4 w-4" />
                  Revogar Token
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!canDelete()}
                  onClick={() => handleDelete(token)}
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
        data={tokens}
        filterColumn="deviceId"
        filterPlaceholder="Filtrar por device ID..."
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
      />

      <AlertDialog
        onOpenChange={(open) => !open && setDeletingToken(null)}
        open={!!deletingToken}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o token do dispositivo{' '}
              <strong className="font-mono text-xs">
                {deletingToken?.deviceId}
              </strong>
              ? Esta ação não pode ser desfeita e o dispositivo precisará ser
              reativado com um novo código.
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
        onOpenChange={(open) => !open && setRevokingToken(null)}
        open={!!revokingToken}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Revogação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja revogar o token do dispositivo{' '}
              <strong className="font-mono text-xs">
                {revokingToken?.deviceId}
              </strong>
              ? Esta ação é <strong>permanente</strong> e não poderá ser
              desfeita. O dispositivo não poderá mais acessar a API com este
              token.
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
    </>
  )
}
