/**
 * @file Hook para Verificação de Papéis e Permissões (Role-Based Access Control).
 * @description Este arquivo contém o hook `useRole`, que fornece um conjunto de funções
 * utilitárias para verificar os papéis (roles) e as permissões do usuário autenticado.
 * Ele consome o `AuthContext` para acessar as `authorities` (papéis) do usuário
 * e simplifica a lógica de controle de acesso em toda a aplicação.
 */
import { useAuth } from '@/contexts/auth-context'

/**
 * @description Hook customizado que oferece funções para verificar os papéis e permissões do usuário.
 * Facilita a implementação de lógica de controle de acesso baseada em papéis (RBAC).
 *
 * @returns Um objeto contendo:
 * - `hasRole`: Função para verificar se o usuário possui um papel específico.
 * - `hasAnyRole`: Função para verificar se o usuário possui pelo menos um dos papéis de uma lista.
 * - `hasAllRoles`: Função para verificar se o usuário possui todos os papéis de uma lista.
 * - `isSuperAdmin`: Atalho para verificar se o usuário é um Super Administrador.
 * - `isAdminConsulta`: Atalho para verificar se o usuário é um Administrador de Consulta.
 * - Funções de permissão (`canWrite`, `canEdit`, `canDelete`, `canCreate`): Funções semânticas
 *   que determinam se o usuário pode realizar ações de escrita, com base em seus papéis.
 * - `userRoles`: Uma lista dos papéis do usuário atual.
 */
export function useRole() {
  const { user } = useAuth()

  /**
   * @description Verifica se o usuário autenticado possui um papel específico.
   * @param {string} role - O nome do papel a ser verificado (ex: 'ROLE_SUPER_ADMIN').
   * @returns {boolean} `true` se o usuário tiver o papel, `false` caso contrário.
   */
  const hasRole = (role: string): boolean => {
    return user?.authorities?.includes(role) ?? false
  }

  /**
   * @description Verifica se o usuário possui pelo menos um dos papéis em uma lista.
   * @param {string[]} roles - Uma lista de papéis a serem verificados.
   * @returns {boolean} `true` se o usuário tiver pelo menos um dos papéis, `false` caso contrário.
   */
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => hasRole(role))
  }

  /**
   * @description Verifica se o usuário possui todos os papéis em uma lista.
   * @param {string[]} roles - Uma lista de papéis a serem verificados.
   * @returns {boolean} `true` se o usuário tiver todos os papéis, `false` caso contrário.
   */
  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every((role) => hasRole(role))
  }

  /**
   * @description Atalho para verificar se o usuário tem o papel de Super Administrador.
   * @returns {boolean} `true` se for Super Admin.
   */
  const isSuperAdmin = (): boolean => {
    return hasRole('ROLE_SUPER_ADMIN')
  }

  /**
   * @description Atalho para verificar se o usuário tem o papel de Administrador de Consulta.
   * @returns {boolean} `true` se for Admin de Consulta.
   */
  const isAdminConsulta = (): boolean => {
    return hasRole('ROLE_ADMIN_CONSULTA')
  }

  /**
   * @description Determina se o usuário tem permissões de escrita (criação, edição, exclusão).
   * Neste sistema, apenas o Super Admin tem essas permissões.
   * @returns {boolean} `true` se o usuário puder escrever dados.
   */
  const canWrite = (): boolean => {
    return isSuperAdmin()
  }

  /**
   * @description Determina se o usuário pode editar dados.
   * @returns {boolean} `true` se o usuário puder editar.
   */
  const canEdit = (): boolean => {
    return canWrite()
  }

  /**
   * @description Determina se o usuário pode excluir dados.
   * @returns {boolean} `true` se o usuário puder excluir.
   */
  const canDelete = (): boolean => {
    return canWrite()
  }

  /**
   * @description Determina se o usuário pode criar novos dados.
   * @returns {boolean} `true` se o usuário puder criar.
   */
  const canCreate = (): boolean => {
    return canWrite()
  }

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isSuperAdmin,
    isAdminConsulta,
    canWrite,
    canEdit,
    canDelete,
    canCreate,
    userRoles: user?.authorities || [],
  }
}
