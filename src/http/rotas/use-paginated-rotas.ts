import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { PaginationParams } from '@/lib/pagination'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig } from '@/services/api'
import type { Rota } from './types'

export function usePaginatedRotas(params?: PaginationParams) {
  return usePaginatedQuery<Rota>({
    queryKey: queryKeys.rotas.all,
    endpoint: apiConfig.endpoints.rotas.list,
    params,
  })
}
