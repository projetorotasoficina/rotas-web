import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { useUpdateMe } from '@/http/me/use-update-me'
import {
  formatCPF,
  formatPhone,
  removeCPFMask,
  removePhoneMask,
} from '@/lib/masks'

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  telefone: z.string().optional().nullable(),
  cpf: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof formSchema>

export function UserSettingsForm() {
  const { user, isLoading } = useAuth()
  const { mutate: updateUser, isPending } = useUpdateMe()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      telefone: '',
      cpf: '',
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        nome: user.nome,
        telefone: user.telefone ? formatPhone(user.telefone) : '',
        cpf: user.cpf ? formatCPF(user.cpf) : '',
      })
    }
  }, [user, form])

  const onSubmit = (data: FormValues) => {
    updateUser({
      ...data,
      telefone: data.telefone ? removePhoneMask(data.telefone) : null,
      cpf: data.cpf ? removeCPFMask(data.cpf) : null,
    })
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Atualize suas informações de perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        {...field}
                        onChange={(e) => {
                          field.onChange(formatPhone(e.target.value))
                        }}
                        value={field.value ?? ''}
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
                        {...field}
                        onChange={(e) => {
                          field.onChange(formatCPF(e.target.value))
                        }}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending || isLoading} type="submit">
                {isPending ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
