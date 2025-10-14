import { createContext, useCallback, useContext, useState } from 'react'

type LoadingContextData = {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextData>(
  {} as LoadingContextData
)

type LoadingProviderProps = {
  children: React.ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingCount, setLoadingCount] = useState(0)

  const startLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1)
  }, [])

  const stopLoading = useCallback(() => {
    setLoadingCount((prev) => Math.max(0, prev - 1))
  }, [])

  const isLoading = loadingCount > 0

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)

  if (!context) {
    throw new Error('useLoading deve ser usado dentro de um LoadingProvider')
  }

  return context
}
