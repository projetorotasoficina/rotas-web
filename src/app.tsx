/**
 * @file Componente Raiz da Aplicação.
 * @description Este arquivo define o componente `App`, que funciona como a raiz da árvore de componentes React.
 *
 * Responsabilidades principais:
 * 1.  **Configuração do React Query (`QueryClient`)**: Define o cliente do TanStack Query com configurações
 *     padrão para `staleTime` e lógica de `retry`, otimizando as requisições de dados.
 *
 * 2.  **Provisão de Contextos Globais**: Encapsula a aplicação com todos os provedores de contexto necessários:
 *     - `QueryClientProvider`: Disponibiliza o cliente React Query para toda a aplicação.
 *     - `AuthProvider`: Gerencia o estado de autenticação do usuário.
 *     - `LoadingProvider`: Controla um estado de carregamento global.
 *     - `QueryAuthGuard`: Um guarda que garante que o React Query não execute queries que necessitam
 *       de autenticação antes que o estado de autenticação seja totalmente carregado.
 *     - `ThemeProvider`: Gerencia o tema da aplicação (dark/light mode).
 *
 * 3.  **Configuração do Roteamento**: Utiliza o `BrowserRouter` do React Router para gerenciar as rotas da aplicação.
 *     - Define a rota pública `/login` para a `LoginPage`.
 *     - Define um grupo de rotas protegidas (`/*`) que são gerenciadas pelo componente `ProtectedRoutes`,
 *       garantindo que apenas usuários autenticados possam acessá-las.
 *
 * 4.  **Componentes Globais**: Renderiza componentes que devem estar disponíveis em toda a aplicação, como:
 *     - `LoadingOverlay`: Exibe um overlay de carregamento com base no `LoadingContext`.
 *     - `Toaster`: Permite a exibição de notificações (toasts) em qualquer lugar da aplicação.
 */
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

/**
 * @description Instância do cliente do TanStack Query.
 * Configurações padrão:
 * - `retry`: Tenta novamente queries falhas até 3 vezes, a menos que o erro seja de autenticação.
 * - `staleTime`: Define que os dados de uma query são considerados "frescos" por 5 minutos,
 *   evitando requisições desnecessárias nesse intervalo.
 * - `mutations`: Desabilita o `retry` para mutações por padrão.
 */
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

/**
 * @description O componente funcional `App` que estrutura toda a aplicação,
 * envolvendo-a nos provedores de contexto e definindo o sistema de rotas.
 * @returns {JSX.Element} A aplicação React pronta para ser renderizada.
 */
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
