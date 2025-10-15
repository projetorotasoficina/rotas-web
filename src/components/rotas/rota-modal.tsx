import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Rota } from '@/http/rotas/types'
import { useCreateRota } from '@/http/rotas/use-create-rota'
import { useUpdateRota } from '@/http/rotas/use-update-rota'
import { useListTipoColeta } from '@/http/tipo-coleta/use-list-tipo-coleta'
import { useListTipoResiduo } from '@/http/tipo-residuo/use-list-tipo-residuo'

const getButtonText = (isEditing: boolean) =>
  isEditing ? 'Salvar' : 'Adicionar'

const rotaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  ativo: z.boolean(),
  observacoes: z
    .string()
    .max(400, 'Observações podem ter no máximo 400 caracteres')
    .optional(),
  tipoResiduoId: z.number().min(1, 'Tipo de resíduo é obrigatório'),
  tipoColetaId: z.number().min(1, 'Tipo de coleta é obrigatório'),
})

type RotaModalProps = {
  isOpen: boolean
  onClose: () => void
  rota?: Rota | null
}

export function RotaModal({ isOpen, onClose, rota }: RotaModalProps) {
  const isEditing = !!rota

  type FormValues = z.infer<typeof rotaSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(rotaSchema),
    defaultValues: {
      nome: '',
      ativo: true,
      observacoes: '',
      tipoResiduoId: 0,
      tipoColetaId: 0,
    },
  })

  const { data: tiposResiduo = [], isLoading: isLoadingResiduos } =
    useListTipoResiduo()
  const { data: tiposColeta = [], isLoading: isLoadingColetas } =
    useListTipoColeta()

  const createMutation = useCreateRota()
  const updateMutation = useUpdateRota()

  useEffect(() => {
    if (rota && isOpen) {
      form.reset({
        nome: rota.nome,
        ativo: rota.ativo,
        observacoes: rota.observacoes || '',
        tipoResiduoId: rota.tipoResiduoId,
        tipoColetaId: rota.tipoColetaId,
      })
    } else if (!isOpen) {
      form.reset({
        nome: '',
        ativo: true,
        observacoes: '',
        tipoResiduoId: 0,
        tipoColetaId: 0,
      })
    }
  }, [rota, isOpen, form])

  const onSubmit = (data: FormValues) => {
    const cleanData = {
      ...data,
      observacoes: data.observacoes || undefined,
    }

    if (isEditing && rota?.id) {
      const dataWithId = { ...cleanData, id: rota.id }
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

  const isLoading = isLoadingResiduos || isLoadingColetas

  return (
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Rota' : 'Adicionar Rota'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere os dados da rota abaixo.'
              : 'Preencha os dados da nova rota.'}
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
                    <Input placeholder="Nome da rota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipoResiduoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Resíduo</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value > 0 ? field.value.toString() : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="(Selecione)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposResiduo.map((tipo) => (
                        <SelectItem
                          key={tipo.id}
                          value={tipo.id?.toString() || ''}
                        >
                          {tipo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipoColetaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Coleta</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value > 0 ? field.value.toString() : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="(Selecione)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposColeta.map((tipo) => (
                        <SelectItem
                          key={tipo.id}
                          value={tipo.id?.toString() || ''}
                        >
                          {tipo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações adicionais (opcional)"
                      {...field}
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
                    <FormLabel>Rota ativa</FormLabel>
                    <p className="text-muted-foreground text-sm">
                      Rotas inativas não podem ser utilizadas em trajetos.
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
