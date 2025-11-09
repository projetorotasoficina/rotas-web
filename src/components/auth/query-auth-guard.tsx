import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'

export function QueryAuthGuard({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { logout } = useAuth()
  const logoutRef = useRef(logout)

  logoutRef.current = logout

  const handleAuthError = useCallback((error: Error) => {
    if (error.message === 'Token expired or unauthorized') {
      logoutRef.current({ showMessage: false, clearCache: false })
    }
  }, [])

  useEffect(() => {
    const unsubscribeMutation = queryClient
      .getMutationCache()
      .subscribe((event) => {
        if (event.type === 'updated' && event.mutation.state.error) {
          handleAuthError(event.mutation.state.error as Error)
        }
      })

    const unsubscribeQuery = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.query.state.error) {
        handleAuthError(event.query.state.error as Error)
      }
    })

    return () => {
      unsubscribeMutation()
      unsubscribeQuery()
    }
  }, [queryClient, handleAuthError])

  return <>{children}</>
}
