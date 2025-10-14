import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoutes } from './components/auth/protected-routes'
import { QueryAuthGuard } from './components/auth/query-auth-guard'
import { LoadingOverlay } from './components/layout/loading-overlay'
import { ThemeProvider } from './components/layout/theme-provider'
import { Toaster } from './components/ui/sonner'
import { AuthProvider } from './contexts/auth-context'
import { LoadingProvider } from './contexts/loading-context'
import { LoginPage } from './pages/login'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error?.message === 'Token expired or unauthorized') {
          return false
        }
        return failureCount < 3
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
    mutations: {
      retry: false,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoadingProvider>
          <QueryAuthGuard>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
              <BrowserRouter>
                <Routes>
                  <Route element={<LoginPage />} path="/login" />
                  <Route element={<ProtectedRoutes />} path="/*" />
                </Routes>
              </BrowserRouter>
              <LoadingOverlay />
              <Toaster />
            </ThemeProvider>
          </QueryAuthGuard>
        </LoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
