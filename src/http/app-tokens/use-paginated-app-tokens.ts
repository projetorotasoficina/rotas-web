import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { PaginationParams } from '@/lib/pagination'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig } from '@/services/api'
import type { AppToken } from './types'

export function usePaginatedAppTokens(params?: PaginationParams) {
  return usePaginatedQuery<AppToken>({
    queryKey: queryKeys.appTokens.all,
    endpoint: apiConfig.endpoints.appTokens.list,
    params,
  })
}
