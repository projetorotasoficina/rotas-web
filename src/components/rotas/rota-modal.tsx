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
  FormDescription,
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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { Rota } from '@/http/rotas/types'
import { useCreateRota } from '@/http/rotas/use-create-rota'
import { useUpdateRota } from '@/http/rotas/use-update-rota'
import { useListTipoColeta } from '@/http/tipo-coleta/use-list-tipo-coleta'
import { useListTipoResiduo } from '@/http/tipo-residuo/use-list-tipo-residuo'
import { PolygonMapEditor } from './polygon-map-editor'

const getButtonText = (isEditing: boolean) =>
  isEditing ? 'Salvar' : 'Adicionar'

const DIAS_SEMANA = [
  'SEGUNDA',
  'TERCA',
  'QUARTA',
  'QUINTA',
  'SEXTA',
  'SABADO',
  'DOMINGO',
] as const

const PERIODOS = ['MANHA', 'TARDE', 'NOITE'] as const

const DIAS_SEMANA_DISPLAY: Record<(typeof DIAS_SEMANA)[number], string> = {
  SEGUNDA: 'Segunda',
  TERCA: 'Terça',
  QUARTA: 'Quarta',
  QUINTA: 'Quinta',
  SEXTA: 'Sexta',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
}

const PERIODOS_DISPLAY: Record<(typeof PERIODOS)[number], string> = {
  MANHA: 'Manhã',
  TARDE: 'Tarde',
  NOITE: 'Noite',
}

const frequenciaSchema = z.object({
  diaSemana: z.enum(DIAS_SEMANA),
  periodo: z.enum(PERIODOS),
})

const polygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(z.array(z.number()))),
})

const rotaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  ativo: z.boolean(),
  observacoes: z
    .string()
    .max(400, 'Observações podem ter no máximo 400 caracteres')
    .optional(),
  tipoResiduoId: z.number().min(1, 'Tipo de resíduo é obrigatório'),
  tipoColetaId: z.number().min(1, 'Tipo de coleta é obrigatório'),
  frequencias: z.array(frequenciaSchema).optional(),
  areaGeografica: polygonSchema.nullable().optional(),
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
      frequencias: [],
      areaGeografica: null,
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
        frequencias: rota.frequencias || [],
        areaGeografica: rota.areaGeografica || null,
      })
    } else if (!isOpen) {
      form.reset({
        nome: '',
        ativo: true,
        observacoes: '',
        tipoResiduoId: 0,
        tipoColetaId: 0,
        frequencias: [],
        areaGeografica: null,
      })
    }
  }, [rota, isOpen, form.reset])

  const onSubmit = (data: FormValues) => {
    const cleanData = {
      ...data,
      observacoes: data.observacoes || undefined,
      frequencias: data.frequencias?.filter((f) => f.diaSemana && f.periodo),
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
  const watchedFrequencias = form.watch('frequencias') || []

  return (
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent className="sm:max-w-7xl">
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
          <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Coluna Esquerda - Campos do Formulário */}
              <div className="space-y-3">
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipoResiduoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Resíduo</FormLabel>
                        <Select
                          disabled={isLoading}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
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
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
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
                </div>

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

                <Separator />

                <div className="space-y-2">
                  <div>
                    <FormLabel>Frequência da Rota</FormLabel>
                    <FormDescription className="text-xs">
                      Selecione os dias e períodos em que a rota será executada
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {DIAS_SEMANA.map((dia) => {
                      const frequenciaDoDia = watchedFrequencias.find(
                        (f) => f.diaSemana === dia
                      )
                      const isChecked = !!frequenciaDoDia

                      return (
                        <div
                          className="flex h-12 items-center gap-3 rounded-md border bg-card px-3 py-2 transition-colors hover:bg-accent/5"
                          key={dia}
                        >
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  const currentFrequencias =
                                    form.getValues('frequencias') || []
                                  if (checked) {
                                    form.setValue('frequencias', [
                                      ...currentFrequencias,
                                      { diaSemana: dia, periodo: 'MANHA' },
                                    ])
                                  } else {
                                    form.setValue(
                                      'frequencias',
                                      currentFrequencias.filter(
                                        (f) => f.diaSemana !== dia
                                      )
                                    )
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer font-normal text-sm">
                              {DIAS_SEMANA_DISPLAY[dia]}
                            </FormLabel>
                          </FormItem>

                          <div className="flex-1">
                            {isChecked && (
                              <FormField
                                control={form.control}
                                name={`frequencias.${watchedFrequencias.findIndex((f) => f.diaSemana === dia)}.periodo`}
                                render={({ field }) => (
                                  <FormItem>
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="h-6 text-xs">
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {PERIODOS.map((p) => (
                                          <SelectItem key={p} value={p}>
                                            {PERIODOS_DISPLAY[p]}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Separator />

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
              </div>

              {/* Coluna Direita - Mapa */}
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="areaGeografica"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Área Geográfica</FormLabel>
                      <FormDescription className="text-xs">
                        Clique no mapa para definir os pontos da área de
                        cobertura
                      </FormDescription>
                      <FormControl>
                        <PolygonMapEditor
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
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
