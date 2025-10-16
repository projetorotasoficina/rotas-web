import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { PaginationParams } from '@/lib/pagination'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig } from '@/services/api'
import type { Usuario } from './types'

export function usePaginatedUsuarios(params?: PaginationParams) {
  return usePaginatedQuery<Usuario>({
    queryKey: queryKeys.usuarios.all,
    endpoint: apiConfig.endpoints.usuarios.list,
    params,
  })
}
