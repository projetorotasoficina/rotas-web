import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'

const CODE_LENGTH = 4

const codeVerificationSchema = z.object({
  code: z
    .string()
    .min(CODE_LENGTH, { message: 'Digite o código de 4 dígitos' }),
})

type CodeVerificationData = z.infer<typeof codeVerificationSchema>

type CodeVerificationFormProps = {
  onSubmit: (code: string) => void
  onBack: () => void
  error?: string | null
  isLoading?: boolean
}

export function CodeVerificationForm({
  onSubmit,
  onBack,
  error,
  isLoading = false,
}: CodeVerificationFormProps) {
  const form = useForm<CodeVerificationData>({
    resolver: zodResolver(codeVerificationSchema),
    defaultValues: {
      code: '',
    },
  })

  function handleSubmit({ code }: CodeVerificationData) {
    onSubmit(code)
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
          name="code"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel>Código de verificação</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={CODE_LENGTH}
                  onChange={field.onChange}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  value={field.value}
                >
                  <InputOTPGroup>
                    <InputOTPSlot className="h-16 w-16 text-xl" index={0} />
                    <InputOTPSlot className="h-16 w-16 text-xl" index={1} />
                    <InputOTPSlot className="h-16 w-16 text-xl" index={2} />
                    <InputOTPSlot className="h-16 w-16 text-xl" index={3} />
                  </InputOTPGroup>
                </InputOTP>
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

        <div className="flex flex-col gap-2">
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? 'Verificando...' : 'Verificar código'}
          </Button>
          <Button
            className="w-full"
            onClick={onBack}
            type="button"
            variant="outline"
          >
            Voltar
          </Button>
        </div>
      </form>
    </Form>
  )
}
