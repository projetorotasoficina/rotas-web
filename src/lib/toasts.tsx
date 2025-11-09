import { CircleX } from 'lucide-react'
import { toast } from 'sonner'

export const showErrorToast = (message: string) => {
  toast.error(message, {
    icon: <CircleX className="h-5 w-5" />,
  })
}
