import { zodResolver } from '@hookform/resolvers/zod'
import { XCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const emailFormSchema = z.object({
  email: z.email({ message: 'Digite um e-mail válido' }),
})

type EmailFormData = z.infer<typeof emailFormSchema>

type EmailFormProps = {
  onSubmit: (email: string) => void
  error?: string | null
  isLoading?: boolean
}

export function EmailForm({
  onSubmit,
  error,
  isLoading = false,
}: EmailFormProps) {
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
    },
  })

  function handleSubmit({ email }: EmailFormData) {
    onSubmit(email)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input {...field} placeholder="nome@exemplo.com" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button className="w-full" disabled={isLoading} type="submit">
          {isLoading ? 'Enviando...' : 'Continuar'}
        </Button>
      </form>
    </Form>
  )
}
