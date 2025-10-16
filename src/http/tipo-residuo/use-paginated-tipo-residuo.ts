import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { PaginationParams } from '@/lib/pagination'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig } from '@/services/api'
import type { TipoResiduo } from './types'

export function usePaginatedTipoResiduo(params?: PaginationParams) {
  return usePaginatedQuery<TipoResiduo>({
    queryKey: queryKeys.tipoResiduo.all,
    endpoint: apiConfig.endpoints.tipoResiduo.list,
    params,
  })
}
