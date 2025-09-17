import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/protected-route'
import { ProtectedRoutes } from './components/auth/protected-routes'
import { ThemeProvider } from './components/layout/theme-provider'
import { AuthProvider } from './contexts/auth-context'
import { LoginPage } from './pages/login'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <BrowserRouter>
            <Routes>
              <Route element={<LoginPage />} path="/login" />
              <Route
                element={
                  <ProtectedRoute>
                    <ProtectedRoutes />
                  </ProtectedRoute>
                }
                path="/*"
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
