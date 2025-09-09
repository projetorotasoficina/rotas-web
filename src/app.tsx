import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/home'
import { LoginPage } from './pages/login'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<HomePage />} index />
          <Route element={<LoginPage />} path="/login" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
