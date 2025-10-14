export function PageLoading() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-muted-foreground text-sm">Carregando...</p>
    </div>
  )
}
