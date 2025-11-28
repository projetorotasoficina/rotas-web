import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/color-picker'
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
import type {
  TipoResiduo,
  TipoResiduoFormData,
} from '@/http/tipo-residuo/types'
import { useCreateTipoResiduo } from '@/http/tipo-residuo/use-create-tipo-residuo'
import { useUpdateTipoResiduo } from '@/http/tipo-residuo/use-update-tipo-residuo'
import { schemas } from '@/lib/validations'

const getButtonText = (isEditing: boolean) =>
  isEditing ? 'Salvar' : 'Adicionar'

const tipoResiduoSchema = schemas.tipoResiduo

type TipoResiduoModalProps = {
  isOpen: boolean
  onClose: () => void
  tipoResiduo?: TipoResiduo | null
}

export function TipoResiduoModal({
  isOpen,
  onClose,
  tipoResiduo,
}: TipoResiduoModalProps) {
  const isEditing = !!tipoResiduo

  const form = useForm<TipoResiduoFormData>({
    resolver: zodResolver(tipoResiduoSchema),
    defaultValues: {
      nome: '',
      corHex: '#3b82f6',
    },
  })

  const createMutation = useCreateTipoResiduo()
  const updateMutation = useUpdateTipoResiduo()

  useEffect(() => {
    if (tipoResiduo && isOpen) {
      form.reset({
        nome: tipoResiduo.nome,
        corHex: tipoResiduo.corHex,
      })
    } else if (!isOpen) {
      form.reset({
        nome: '',
        corHex: '#3b82f6',
      })
    }
  }, [tipoResiduo, isOpen, form])

  const onSubmit = (data: TipoResiduoFormData) => {
    const cleanData = {
      ...data,
      nome: data.nome.trim(),
      corHex: data.corHex.toUpperCase(),
    }

    if (isEditing && tipoResiduo?.id) {
      const dataWithId = { ...cleanData, id: tipoResiduo.id }
      updateMutation.mutate(dataWithId, {
        onSuccess: () => {
          onClose()
          form.reset()
        },
      })
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
            {isEditing ? 'Editar Tipo de Resíduo' : 'Adicionar Tipo de Resíduo'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere os dados do tipo de resíduo abaixo.'
              : 'Preencha os dados do novo tipo de resíduo.'}
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
                      placeholder="Nome do tipo de resíduo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="corHex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        className="flex-1 font-mono"
                        maxLength={7}
                        placeholder="#3b82f6"
                        {...field}
                      />
                    </FormControl>
                    <ColorPicker
                      onChange={field.onChange}
                      value={field.value}
                    />
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
