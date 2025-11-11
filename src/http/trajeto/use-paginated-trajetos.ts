import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { PaginationParams } from '@/lib/pagination'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig } from '@/services/api'
import type { Trajeto } from './types'

export function usePaginatedTrajetos(params?: PaginationParams) {
  return usePaginatedQuery<Trajeto>({
    queryKey: queryKeys.trajetos.all,
    endpoint: apiConfig.endpoints.trajetos.list,
    params,
  })
}
