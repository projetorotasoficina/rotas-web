import { toast } from 'sonner'
import { CircleX } from 'lucide-react'

export const showErrorToast = (message: string) => {
  toast.error(message, {
    icon: <CircleX className="h-5 w-5" />,
  })
}
