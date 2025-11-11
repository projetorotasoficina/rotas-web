import { vi } from 'vitest'

/**
 * Mock completo do hook useRole para testes
 */
export const mockUseRole = (
  overrides?: Partial<ReturnType<typeof import('@/hooks/use-role').useRole>>
) => {
  const defaultMock = {
    hasRole: vi.fn(() => true),
    hasAnyRole: vi.fn(() => true),
    hasAllRoles: vi.fn(() => true),
    isSuperAdmin: vi.fn(() => true),
    isAdminConsulta: vi.fn(() => false),
    canWrite: vi.fn(() => true),
    canEdit: vi.fn(() => true),
    canDelete: vi.fn(() => true),
    canCreate: vi.fn(() => true),
    userRoles: ['ROLE_SUPER_ADMIN'],
  }

  return {
    ...defaultMock,
    ...overrides,
  }
}
