import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { PaginationParams } from '@/lib/pagination'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig } from '@/services/api'
import type { Motorista } from './types'

export function usePaginatedMotoristas(params?: PaginationParams) {
  return usePaginatedQuery<Motorista>({
    queryKey: queryKeys.motoristas.all,
    endpoint: apiConfig.endpoints.motoristas.list,
    params,
  })
}
