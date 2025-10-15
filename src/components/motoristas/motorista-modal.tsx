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
import type { Motorista, MotoristaFormData } from '@/http/motoristas/types'
import { useCreateMotorista } from '@/http/motoristas/use-create-motorista'
import { useUpdateMotorista } from '@/http/motoristas/use-update-motorista'
import { formatCPF, isValidCPF, removeCPFMask } from '@/lib/masks'

const getButtonText = (isEditing: boolean) =>
  isEditing ? 'Salvar' : 'Adicionar'

const CNH_CATEGORIA_REGEX = /^(A|B|C|D|E|AB|AC|AD|AE)$/

const motoristaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .refine(isValidCPF, 'CPF deve ter 11 dígitos válidos'),
  cnhCategoria: z
    .string()
    .optional()
    .refine(
      (val) => !val || CNH_CATEGORIA_REGEX.test(val),
      'Categoria da CNH inválida. Aceitas: A, B, C, D, E, AB, AC, AD ou AE'
    ),
  cnhValidade: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) {
        return true
      }
      const selectedDate = new Date(val)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate > today
    }, 'A validade da CNH deve ser uma data futura'),
  ativo: z.boolean(),
})

type MotoristaModalProps = {
  isOpen: boolean
  onClose: () => void
  motorista?: Motorista | null
}

export function MotoristaModal({
  isOpen,
  onClose,
  motorista,
}: MotoristaModalProps) {
  const isEditing = !!motorista

  const form = useForm<MotoristaFormData>({
    resolver: zodResolver(motoristaSchema),
    defaultValues: {
      nome: '',
      cpf: '',
      cnhCategoria: '',
      cnhValidade: '',
      ativo: true,
    },
  })

  const createMutation = useCreateMotorista()
  const updateMutation = useUpdateMotorista()

  useEffect(() => {
    if (motorista && isOpen) {
      form.reset({
        nome: motorista.nome,
        cpf: formatCPF(motorista.cpf),
        cnhCategoria: motorista.cnhCategoria || '',
        cnhValidade: motorista.cnhValidade
          ? new Date(motorista.cnhValidade).toISOString().split('T')[0]
          : '',
        ativo: motorista.ativo,
      })
    } else if (!isOpen) {
      form.reset({
        nome: '',
        cpf: '',
        cnhCategoria: '',
        cnhValidade: '',
        ativo: true,
      })
    }
  }, [motorista, isOpen, form])

  const onSubmit = (data: MotoristaFormData) => {
    const cleanData = {
      ...data,
      cpf: removeCPFMask(data.cpf),
      cnhValidade: data.cnhValidade || undefined,
      cnhCategoria: data.cnhCategoria || undefined,
    }

    if (isEditing && motorista?.id) {
      const dataWithId = { ...cleanData, id: motorista.id }
      updateMutation.mutate(dataWithId, {
        onSuccess: () => {
          onClose()
          form.reset()
        },
      })
    } else {
      const { id: _id, ...creationData } = cleanData
      createMutation.mutate(creationData, {
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
            {isEditing ? 'Editar Motorista' : 'Adicionar Motorista'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere os dados do motorista abaixo.'
              : 'Preencha os dados do novo motorista.'}
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
                    <Input placeholder="Nome completo" {...field} />
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
              name="cnhCategoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria CNH</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                      <SelectItem value="AC">AC</SelectItem>
                      <SelectItem value="AD">AD</SelectItem>
                      <SelectItem value="AE">AE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnhValidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validade CNH</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                    <FormLabel>Motorista ativo</FormLabel>
                    <p className="text-muted-foreground text-sm">
                      Motoristas inativos não podem ser associados a rotas.
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
