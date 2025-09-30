import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useRole } from '@/hooks/use-role'

type RoleGuardProps = {
  children: React.ReactNode
  requiredRole: string
  fallbackContent?: React.ReactNode
}

export function RoleGuard({
  children,
  requiredRole,
  fallbackContent,
}: RoleGuardProps) {
  const { hasRole } = useRole()

  const hasRequiredRole = hasRole(requiredRole)

  if (!hasRequiredRole) {
    if (fallbackContent) {
      return <>{fallbackContent}</>
    }

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-8 rounded-full bg-muted p-6">
          <AlertTriangle className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="mb-2 font-bold text-4xl text-foreground">403</h1>
        <h2 className="mb-2 font-semibold text-2xl text-foreground">
          Acesso Negado
        </h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          Você não possui permissão para acessar esta página. Entre em contato
          com o administrador do sistema.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/">Voltar para Home</Link>
          </Button>
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
