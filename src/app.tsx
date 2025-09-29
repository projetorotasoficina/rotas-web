import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoutes } from './components/auth/protected-routes'
import { QueryAuthGuard } from './components/auth/query-auth-guard'
import { ThemeProvider } from './components/layout/theme-provider'
import { Toaster } from './components/ui/sonner'
import { AuthProvider } from './contexts/auth-context'
import { LoginPage } from './pages/login'

const MAX_RETRY_ATTEMPTS = 3
const STALE_TIME_MINUTES = 5
const SECONDS_TO_MS = 1000
const MINUTES_TO_MS = 60 * SECONDS_TO_MS

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error?.message === 'Token expired or unauthorized') {
          return false
        }
        return failureCount < MAX_RETRY_ATTEMPTS
      },
      staleTime: STALE_TIME_MINUTES * MINUTES_TO_MS,
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
        <QueryAuthGuard>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <BrowserRouter>
              <Routes>
                <Route element={<LoginPage />} path="/login" />
                <Route element={<ProtectedRoutes />} path="/*" />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </ThemeProvider>
        </QueryAuthGuard>
      </AuthProvider>
    </QueryClientProvider>
  )
}
