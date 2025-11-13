import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type LoadingContextData = {
  isLoading: boolean
  startLoading: () => string
  stopLoading: (id: string) => void
}

const LoadingContext = createContext<LoadingContextData>(
  {} as LoadingContextData
)

type LoadingProviderProps = {
  children: React.ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())

  const startLoading = useCallback(() => {
    const id = crypto.randomUUID()
    setLoadingIds((prev) => new Set([...prev, id]))
    return id
  }, [])

  const stopLoading = useCallback((id: string) => {
    setLoadingIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const isLoading = loadingIds.size > 0

  const value = useMemo(
    () => ({ isLoading, startLoading, stopLoading }),
    [isLoading, startLoading, stopLoading]
  )

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)

  if (!context) {
    throw new Error('useLoading deve ser usado dentro de um LoadingProvider')
  }

  return context
}
