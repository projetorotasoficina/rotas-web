import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { RoleGuard } from '@/components/auth/role-guard'
import { PageLoading } from '@/components/layout/page-loading'
import { useAuth } from '@/contexts/auth-context'
import { DefaultLayout } from '@/layouts/default-layout'

// Lazy loading de páginas - carrega sob demanda
const HomePage = lazy(() => import('@/pages/home'))
const AdministradoresPage = lazy(() => import('@/pages/administradores'))
const AppAndroidPage = lazy(() => import('@/pages/app-android'))
const CaminhoesPage = lazy(() => import('@/pages/caminhoes'))
const MapaAreasGeograficas = lazy(
  () => import('@/pages/mapa-areas-geograficas')
)
const MapaTrajetosPage = lazy(() => import('@/pages/mapa-trajetos'))
const MotoristasPage = lazy(() => import('@/pages/motoristas'))
const RotasPage = lazy(() => import('@/pages/rotas'))
const TipoColetaPage = lazy(() => import('@/pages/tipo-coleta'))
const TipoResiduoPage = lazy(() => import('@/pages/tipo-residuo'))
const UserSettings = lazy(() => import('@/pages/user-settings'))

export function ProtectedRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <PageLoading />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />
  }
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <PageLoading />
        </div>
      }
    >
      <Routes>
        <Route
          element={
            <DefaultLayout title="Home">
              <HomePage />
            </DefaultLayout>
          }
          index
        />

        <Route
          element={
            <DefaultLayout
              breadcrumbs={[
                { label: 'Cadastros', href: '/' },
                { label: 'Pessoas' },
                { label: 'Administradores' },
              ]}
            >
              <RoleGuard requiredRole="ROLE_SUPER_ADMIN">
                <AdministradoresPage />
              </RoleGuard>
            </DefaultLayout>
          }
          path="/pessoas/administradores"
        />
        <Route
          element={
            <DefaultLayout
              breadcrumbs={[
                { label: 'Cadastros', href: '/' },
                { label: 'Pessoas' },
                { label: 'Motoristas' },
              ]}
            >
              <MotoristasPage />
            </DefaultLayout>
          }
          path="/pessoas/motoristas"
        />

        <Route
          element={
            <DefaultLayout
              breadcrumbs={[
                { label: 'Cadastros', href: '/' },
                { label: 'Operações' },
                { label: 'Caminhões' },
              ]}
            >
              <CaminhoesPage />
            </DefaultLayout>
          }
          path="/operacoes/caminhoes"
        />
        <Route
          element={
            <DefaultLayout
              breadcrumbs={[
                { label: 'Cadastros', href: '/' },
                { label: 'Operações' },
                { label: 'Rotas' },
              ]}
            >
              <RotasPage />
            </DefaultLayout>
          }
          path="/operacoes/rotas"
        />
        <Route
          element={
            <DefaultLayout
              breadcrumbs={[
                { label: 'Cadastros', href: '/' },
                { label: 'Operações' },
                { label: 'Tipos de Coleta' },
              ]}
            >
              <TipoColetaPage />
            </DefaultLayout>
          }
          path="/operacoes/tipos-coleta"
        />
        <Route
          element={
            <DefaultLayout
              breadcrumbs={[
                { label: 'Cadastros', href: '/' },
                { label: 'Operações' },
                { label: 'Tipos de Resíduo' },
              ]}
            >
              <TipoResiduoPage />
            </DefaultLayout>
          }
          path="/operacoes/tipos-residuo"
        />

        <Route
          element={
            <DefaultLayout
              breadcrumbs={[
                { label: 'Gestão', href: '/' },
                { label: 'App Android' },
              ]}
            >
              <RoleGuard requiredRole="ROLE_SUPER_ADMIN">
                <AppAndroidPage />
              </RoleGuard>
            </DefaultLayout>
          }
          path="/app-android"
        />

        <Route
          element={
            <DefaultLayout
              breadcrumbs={[
                { label: 'Gestão', href: '/' },
                { label: 'Mapa de Trajetos' },
              ]}
            >
              <MapaTrajetosPage />
            </DefaultLayout>
          }
          path="/documentos/mapa-trajetos"
        />

        <Route
          element={
            <DefaultLayout
              breadcrumbs={[
                { label: 'Gestão', href: '/' },
                { label: 'Áreas Geográficas' },
              ]}
            >
              <MapaAreasGeograficas />
            </DefaultLayout>
          }
          path="/gestao/areas-geograficas"
        />

        <Route
          element={
            <DefaultLayout
              breadcrumbs={[
                { label: 'Documentos' },
                { label: 'Relatório de Rotas' },
              ]}
            >
              <div>Página de Relatório de Rotas em desenvolvimento...</div>
            </DefaultLayout>
          }
          path="/documentos/relatorio-rotas"
        />
        <Route
          element={
            <DefaultLayout
              breadcrumbs={[
                { label: 'Documentos' },
                { label: 'Relatório de Incidentes' },
              ]}
            >
              <div>Página de Relatório de Incidentes em desenvolvimento...</div>
            </DefaultLayout>
          }
          path="/documentos/relatorio-incidentes"
        />

        <Route
          element={
            <DefaultLayout
              breadcrumbs={[{ label: 'Configurações' }, { label: 'Usuário' }]}
            >
              <UserSettings />
            </DefaultLayout>
          }
          path="/user-settings"
        />

        <Route
          element={
            <DefaultLayout title="Página não encontrada">
              <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <div className="mb-8 rounded-full bg-muted p-6">
                  <AlertTriangle className="h-16 w-16 text-muted-foreground" />
                </div>
                <h1 className="mb-2 font-bold text-6xl text-foreground">404</h1>
                <h2 className="mb-2 font-semibold text-2xl text-foreground">
                  Página não encontrada
                </h2>
                <p className="mb-8 max-w-md text-muted-foreground">
                  A página que você está procurando não existe ou foi movida.
                  Verifique o endereço e tente novamente.
                </p>
                <div className="flex gap-4">
                  <Link
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                    to="/"
                  >
                    <Home className="h-4 w-4" />
                    Voltar para Home
                  </Link>
                  <button
                    className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => window.history.back()}
                    type="button"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </button>
                </div>
              </div>
            </DefaultLayout>
          }
          path="*"
        />
      </Routes>
    </Suspense>
  )
}
