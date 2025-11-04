import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { PaginationParams } from '@/lib/pagination'
import { queryKeys } from '@/lib/query-keys'
import { apiConfig } from '@/services/api'
import type { CodigoAtivacao } from './types'

export function usePaginatedCodigosAtivacao(params?: PaginationParams) {
  return usePaginatedQuery<CodigoAtivacao>({
    queryKey: queryKeys.codigosAtivacao.all,
    endpoint: apiConfig.endpoints.codigosAtivacao.list,
    params,
  })
}
