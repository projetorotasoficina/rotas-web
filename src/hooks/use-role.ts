import { useAuth } from '@/contexts/auth-context'

export function useRole() {
  const { user } = useAuth()

  const hasRole = (role: string): boolean => {
    return user?.authorities?.includes(role) ?? false
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => hasRole(role))
  }

  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every((role) => hasRole(role))
  }

  const isSuperAdmin = (): boolean => {
    return hasRole('ROLE_SUPER_ADMIN')
  }

  const isAdminConsulta = (): boolean => {
    return hasRole('ROLE_ADMIN_CONSULTA')
  }

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isSuperAdmin,
    isAdminConsulta,
    userRoles: user?.authorities || [],
  }
}
