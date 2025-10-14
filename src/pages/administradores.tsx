import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AdministradorModal } from '@/components/administradores/administrador-modal'
import { PageLoading } from '@/components/layout/page-loading'
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
import type { Usuario } from '@/http/usuarios/types'
import { useDeleteUsuario } from '@/http/usuarios/use-delete-usuario'
import { useListUsuarios } from '@/http/usuarios/use-list-usuarios'
import { displayCPF } from '@/lib/masks'

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

export function AdministradoresPage() {
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)
  const [deletingUsuario, setDeletingUsuario] = useState<Usuario | null>(null)

  const { data: usuarios = [], isLoading } = useListUsuarios()
  const deleteMutation = useDeleteUsuario()

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario)
    setIsModalOpen(true)
  }

  const handleDelete = (usuario: Usuario) => {
    if (user?.email === usuario.email) {
      toast.error('Você não pode excluir sua própria conta!')
      return
    }
    setDeletingUsuario(usuario)
  }

  const confirmDelete = () => {
    if (deletingUsuario?.id) {
      deleteMutation.mutate(deletingUsuario.id)
      setDeletingUsuario(null)
    }
  }

  const handleAdd = () => {
    setEditingUsuario(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUsuario(null)
  }

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

  if (isLoading) {
    return <PageLoading />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Administradores</h1>
      </div>

      <DataTable
        columns={columns}
        data={usuarios}
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
