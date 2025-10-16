import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { fetchPaginated } from '@/lib/fetch-paginated'
import type { PageResponse, PaginationParams } from '@/lib/pagination'

type UsePaginatedQueryOptions<T> = {
  queryKey: readonly unknown[]
  endpoint: string
  params?: PaginationParams
  options?: Omit<UseQueryOptions<PageResponse<T>>, 'queryKey' | 'queryFn'>
}

export function usePaginatedQuery<T>({
  queryKey,
  endpoint,
  params,
  options,
}: UsePaginatedQueryOptions<T>) {
  return useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => fetchPaginated<T>(endpoint, params),
    placeholderData: (previousData) => previousData, // Mantém dados anteriores durante loading
    ...options,
  })
}
