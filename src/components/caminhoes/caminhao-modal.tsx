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
import type { Caminhao, CaminhaoFormData } from '@/http/caminhoes/types'
import { useCreateCaminhao } from '@/http/caminhoes/use-create-caminhao'
import { useUpdateCaminhao } from '@/http/caminhoes/use-update-caminhao'
import { useListTipoColeta } from '@/http/tipo-coleta/use-list-tipo-coleta'
import { useListTipoResiduo } from '@/http/tipo-residuo/use-list-tipo-residuo'

const getButtonText = (isEditing: boolean) =>
  isEditing ? 'Salvar' : 'Adicionar'

const caminhaoSchema = z.object({
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  placa: z
    .string()
    .min(1, 'Placa é obrigatória')
    .regex(/^([A-Z]{3}\d{4})|([A-Z]{3}\d[A-Z]\d{2})$/,
      'Placa deve estar no formato Mercosul (XXX0X00) ou no formato antigo (XXX0000)'
    ),
  tipoColetaId: z.number().min(1, 'Tipo de coleta é obrigatório'),
  residuoId: z.number().min(1, 'Tipo de resíduo é obrigatório'),
  ativo: z.boolean(),
})

type CaminhaoModalProps = {
  isOpen: boolean
  onClose: () => void
  caminhao?: Caminhao | null
}

export function CaminhaoModal({
  isOpen,
  onClose,
  caminhao,
}: CaminhaoModalProps) {
  const isEditing = !!caminhao

  const form = useForm<CaminhaoFormData>({
    resolver: zodResolver(caminhaoSchema),
    defaultValues: {
      modelo: '',
      placa: '',
      ativo: true,
    },
  })

  const { data: tiposColeta = [] } = useListTipoColeta()
  const { data: tiposResiduo = [] } = useListTipoResiduo()

  const createMutation = useCreateCaminhao()
  const updateMutation = useUpdateCaminhao()

  useEffect(() => {
    if (caminhao && isOpen) {
      form.reset({
        modelo: caminhao.modelo,
        placa: caminhao.placa,
        tipoColetaId: caminhao.tipoColetaId,
        residuoId: caminhao.residuoId,
        ativo: caminhao.ativo,
      })
    } else if (!isOpen) {
      form.reset({
        modelo: '',
        placa: '',
        ativo: true,
      })
    }
  }, [caminhao, isOpen, form])

  const onSubmit = (data: CaminhaoFormData) => {
    if (isEditing && caminhao?.id) {
      const dataWithId = { ...data, id: caminhao.id }
      updateMutation.mutate(dataWithId, {
        onSuccess: () => {
          onClose()
          form.reset()
        },
      })
    } else {
      createMutation.mutate(data, {
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
            {isEditing ? 'Editar Caminhão' : 'Adicionar Caminhão'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere os dados do caminhão abaixo.'
              : 'Preencha os dados do novo caminhão.'}
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
              name="modelo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder="Modelo do caminhão" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="placa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={8}
                      placeholder="XXX-0000"
                      {...field}
                    />
                  </FormControl>
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
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de coleta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposColeta.map((tipo) => (
                        <SelectItem key={tipo.id} value={String(tipo.id)}>
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
              name="residuoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Resíduo</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de resíduo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposResiduo.map((tipo) => (
                        <SelectItem key={tipo.id} value={String(tipo.id)}>
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
                    <FormLabel>Caminhão ativo</FormLabel>
                    <p className="text-muted-foreground text-sm">
                      Caminhões inativos não podem ser associados a rotas.
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
