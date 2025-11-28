import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import type { Usuario, UsuarioFormData } from '@/http/usuarios/types'
import { useCreateUsuario } from '@/http/usuarios/use-create-usuario'
import { useUpdateUsuario } from '@/http/usuarios/use-update-usuario'
import {
  formatCPF,
  formatPhone,
  removeCPFMask,
  removePhoneMask,
} from '@/lib/masks'
import { schemas } from '@/lib/validations'

const getButtonText = (isEditing: boolean) =>
  isEditing ? 'Salvar' : 'Adicionar'

const usuarioSchema = schemas.usuario

type AdministradorModalProps = {
  isOpen: boolean
  onClose: () => void
  usuario?: Usuario | null
}

export function AdministradorModal({
  isOpen,
  onClose,
  usuario,
}: AdministradorModalProps) {
  const { user } = useAuth()
  const isEditing = !!usuario
  const isEditingSelf = isEditing && user?.email === usuario?.email

  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      ativo: true,
      roles: ['ROLE_ADMIN_CONSULTA'],
    },
  })

  const createMutation = useCreateUsuario()
  const updateMutation = useUpdateUsuario()

  useEffect(() => {
    if (usuario && isOpen) {
      form.reset({
        nome: usuario.nome,
        cpf: formatCPF(usuario.cpf),
        email: usuario.email,
        telefone: usuario.telefone ? formatPhone(usuario.telefone) : '',
        ativo: usuario.ativo,
        roles: usuario.roles,
      })
    } else if (!isOpen) {
      form.reset({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        ativo: true,
        roles: ['ROLE_ADMIN_CONSULTA'],
      })
    }
  }, [usuario, isOpen, form])

  const onSubmit = (data: UsuarioFormData) => {
    const cleanData = {
      ...data,
      cpf: removeCPFMask(data.cpf),
      telefone: data.telefone ? removePhoneMask(data.telefone) : undefined,
    }

    if (isEditing && usuario?.id) {
      const dataWithId = { ...cleanData, id: usuario.id }
      updateMutation.mutate(
        { id: usuario.id, data: dataWithId },
        {
          onSuccess: () => {
            onClose()
            form.reset()
          },
        }
      )
    } else {
      createMutation.mutate(cleanData, {
        onSuccess: () => {
          onClose()
          form.reset()
        },
      })
    }
  }

  const handleClose = () => {
    onClose()
    form.reset()
  }

  return (
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Administrador' : 'Adicionar Administrador'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere os dados do administrador abaixo.'
              : 'Preencha os dados do novo administrador.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={100}
                      placeholder="Nome completo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={14}
                      placeholder="000.000.000-00"
                      {...field}
                      onChange={(e) => {
                        const formattedValue = formatCPF(e.target.value)
                        field.onChange(formattedValue)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isEditingSelf}
                      maxLength={100}
                      placeholder="email@exemplo.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  {isEditingSelf && (
                    <p className="text-muted-foreground text-sm">
                      Você não pode alterar seu próprio e-mail
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={15}
                      placeholder="(00) 00000-0000"
                      {...field}
                      onChange={(e) => {
                        const formattedValue = formatPhone(e.target.value)
                        field.onChange(formattedValue)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Usuário ativo</FormLabel>
                    <p className="text-muted-foreground text-sm">
                      Usuários inativos não podem fazer login no sistema
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button onClick={handleClose} type="button" variant="outline">
                Cancelar
              </Button>
              <Button
                disabled={createMutation.isPending || updateMutation.isPending}
                type="submit"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Salvando...'
                  : getButtonText(isEditing)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
