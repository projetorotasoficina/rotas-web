import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { PaginationParams } from '@/lib/pagination'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig } from '@/services/api'
import type { TipoColeta } from './types'

export function usePaginatedTipoColeta(params?: PaginationParams) {
  return usePaginatedQuery<TipoColeta>({
    queryKey: queryKeys.tipoColeta.all,
    endpoint: apiConfig.endpoints.tipoColeta.list,
    params,
  })
}
