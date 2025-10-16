import { fetchWithAuth } from '@/services/api'
import type { PageResponse, PaginationParams } from './pagination'

export async function fetchPaginated<T>(
  endpoint: string,
  params?: PaginationParams
): Promise<PageResponse<T>> {
  const searchParams = new URLSearchParams()

  searchParams.append('page', (params?.page ?? 0).toString())

  searchParams.append('size', (params?.size ?? 10).toString())

  if (params?.order) {
    searchParams.append('order', params.order)
    searchParams.append('asc', (params.asc ?? true).toString())
  }

  if (params?.search) {
    searchParams.append('search', params.search)
  }

  const url = `${endpoint}/page?${searchParams.toString()}`
  const response = await fetchWithAuth(url)
  return response.json()
}
