import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
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
import type { TipoColeta, TipoColetaFormData } from '@/http/tipo-coleta/types'
import { useCreateTipoColeta } from '@/http/tipo-coleta/use-create-tipo-coleta'
import { useUpdateTipoColeta } from '@/http/tipo-coleta/use-update-tipo-coleta'
import { schemas } from '@/lib/validations'

const getButtonText = (isEditing: boolean) =>
  isEditing ? 'Salvar' : 'Adicionar'

const tipoColetaSchema = schemas.tipoColeta

type TipoColetaModalProps = {
  isOpen: boolean
  onClose: () => void
  tipoColeta?: TipoColeta | null
}

export function TipoColetaModal({
  isOpen,
  onClose,
  tipoColeta,
}: TipoColetaModalProps) {
  const isEditing = !!tipoColeta

  const form = useForm<TipoColetaFormData>({
    resolver: zodResolver(tipoColetaSchema),
    defaultValues: {
      nome: '',
    },
  })

  const createMutation = useCreateTipoColeta()
  const updateMutation = useUpdateTipoColeta()

  useEffect(() => {
    if (tipoColeta && isOpen) {
      form.reset({
        nome: tipoColeta.nome,
      })
    } else if (!isOpen) {
      form.reset({
        nome: '',
      })
    }
  }, [tipoColeta, isOpen, form])

  const onSubmit = (data: TipoColetaFormData) => {
    const cleanData = {
      ...data,
      nome: data.nome.trim(),
    }

    if (isEditing && tipoColeta?.id) {
      const dataWithId = { ...cleanData, id: tipoColeta.id }
      updateMutation.mutate(
        { id: tipoColeta.id, data: dataWithId },
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
            {isEditing ? 'Editar Tipo de Coleta' : 'Adicionar Tipo de Coleta'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere os dados do tipo de coleta abaixo.'
              : 'Preencha os dados do novo tipo de coleta.'}
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
                      placeholder="Nome do tipo de coleta"
                      {...field}
                    />
                  </FormControl>
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
