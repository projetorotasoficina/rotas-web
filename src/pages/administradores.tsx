/**
 * @file Página de Gerenciamento de Administradores.
 * @description Este arquivo define o componente `AdministradoresPage`, que renderiza a interface
 * para gerenciar os usuários administradores do sistema. A página implementa uma funcionalidade
 * completa de CRUD (Criar, Ler, Atualizar, Excluir) para os administradores.
 *
 * Funcionalidades Principais:
 * - **Listagem e Paginação**: Exibe os administradores em uma tabela de dados (`DataTable`) com
 *   suporte a paginação, ordenação e busca do lado do servidor.
 * - **Criação e Edição**: Utiliza um modal (`AdministradorModal`) para adicionar novos
 *   administradores ou editar os existentes.
 * - **Exclusão**: Apresenta um diálogo de confirmação (`AlertDialog`) antes de excluir
 *   um administrador, para evitar ações acidentais.
 * - **Controle de Acesso**: As ações de criar, editar e excluir são controladas com base
 *   nas permissões do usuário logado, obtidas através do hook `useRole`.
 * - **Busca com Debounce**: O campo de busca utiliza o hook `useDebounce` para otimizar
 *   as requisições à API, evitando chamadas a cada tecla pressionada.
 */
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AdministradorModal } from '@/components/administradores/administrador-modal'
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
import { useAuth } from '@/contexts/auth-context'
import { useDebounce } from '@/hooks/use-debounce'
import type { Usuario } from '@/http/usuarios/types'
import { useDeleteUsuario } from '@/http/usuarios/use-delete-usuario'
import { usePaginatedUsuarios } from '@/http/usuarios/use-paginated-usuarios'
import { displayCPF } from '@/lib/masks'

/**
 * @description Retorna um rótulo legível para um papel (role) do sistema.
 * @param {string} role - O papel (ex: 'ROLE_SUPER_ADMIN').
 * @returns {string} O rótulo correspondente (ex: 'Super Admin').
 */
const getRoleLabel = (role: string) => {
  switch (role) {
    case 'ROLE_SUPER_ADMIN':
      return 'Super Admin'
    case 'ROLE_ADMIN_CONSULTA':
      return 'Admin Consulta'
    default:
      return role
  }
}

/**
 * @description Retorna a variante de cor do componente `Badge` com base no papel.
 * @param {string} role - O papel do sistema.
 * @returns {'destructive' | 'secondary' | 'default'} A variante do badge.
 */
const getRoleVariant = (role: string) => {
  switch (role) {
    case 'ROLE_SUPER_ADMIN':
      return 'destructive' as const
    case 'ROLE_ADMIN_CONSULTA':
      return 'secondary' as const
    default:
      return 'default' as const
  }
}

/**
 * @description Componente que renderiza a página de gerenciamento de administradores.
 */
export function AdministradoresPage() {
  const { user } = useAuth()
  // Estados para controlar a abertura de modais e os dados em edição/exclusão.
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)
  const [deletingUsuario, setDeletingUsuario] = useState<Usuario | null>(null)

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
  } = usePaginatedUsuarios({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    order: sorting[0]?.id,
    asc: sorting[0]?.desc === false,
    search: debouncedSearch,
  })

  const usuarios = response?.content ?? []
  // Hook de mutação para excluir um usuário.
  const deleteMutation = useDeleteUsuario()

  /**
   * @description Abre o modal de edição com os dados do usuário selecionado.
   * @param {Usuario} usuario - O usuário a ser editado.
   */
  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario)
    setIsModalOpen(true)
  }

  /**
   * @description Define o usuário a ser excluído e abre o diálogo de confirmação.
   * Impede que o usuário exclua a própria conta.
   * @param {Usuario} usuario - O usuário a ser excluído.
   */
  const handleDelete = (usuario: Usuario) => {
    if (user?.email === usuario.email) {
      toast.error('Você não pode excluir sua própria conta!')
      return
    }
    setDeletingUsuario(usuario)
  }

  /**
   * @description Confirma e executa a exclusão do usuário.
   */
  const confirmDelete = () => {
    if (deletingUsuario?.id) {
      deleteMutation.mutate(deletingUsuario.id)
      setDeletingUsuario(null)
    }
  }

  /**
   * @description Abre o modal para adicionar um novo usuário.
   */
  const handleAdd = () => {
    setEditingUsuario(null)
    setIsModalOpen(true)
  }

  /**
   * @description Fecha o modal de adição/edição e limpa o estado.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUsuario(null)
  }

  // Definição das colunas para a DataTable.
  const columns: ColumnDef<Usuario>[] = [
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
      accessorKey: 'email',
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
              E-mail
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
      accessorKey: 'telefone',
      header: 'Telefone',
      cell: ({ row }) => {
        const telefone = row.getValue('telefone') as string
        return telefone || '-'
      },
    },
    {
      accessorKey: 'roles',
      header: 'Permissões',
      cell: ({ row }) => {
        const roles = row.getValue('roles') as string[]
        return (
          <div className="flex gap-1">
            {roles.map((role) => (
              <Badge key={role} variant={getRoleVariant(role)}>
                {getRoleLabel(role)}
              </Badge>
            ))}
          </div>
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
        const usuario = row.original

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
                <DropdownMenuItem onClick={() => handleEdit(usuario)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={user?.email === usuario.email}
                  onClick={() => handleDelete(usuario)}
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
        <h1 className="font-bold text-2xl">Administradores</h1>
      </div>

      <DataTable
        columns={columns}
        data={usuarios}
        filterPlaceholder="Filtrar por nome ou email..."
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
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        }
      />

      <AdministradorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        usuario={editingUsuario}
      />

      <AlertDialog
        onOpenChange={(open) => !open && setDeletingUsuario(null)}
        open={!!deletingUsuario}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o administrador{' '}
              <strong>{deletingUsuario?.nome}</strong>? Esta ação não pode ser
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
