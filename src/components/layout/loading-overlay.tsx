import { useLoading } from '@/contexts/loading-context'

export function LoadingOverlay() {
  const { isLoading } = useLoading()

  if (!isLoading) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground text-sm">Carregando...</p>
      </div>
    </div>
  )
}
