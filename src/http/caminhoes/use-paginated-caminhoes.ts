import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { PaginationParams } from '@/lib/pagination'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig } from '@/services/api'
import type { Caminhao } from './types'

export function usePaginatedCaminhoes(params?: PaginationParams) {
  return usePaginatedQuery<Caminhao>({
    queryKey: queryKeys.caminhoes.all,
    endpoint: apiConfig.endpoints.caminhoes.list,
    params,
  })
}
