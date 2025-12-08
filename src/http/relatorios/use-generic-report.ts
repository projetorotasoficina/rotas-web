import { useQuery } from '@tanstack/react-query'
import { fetchWithAuth } from '@/services/api'
import type { GenericReportData, GenericReportParams } from './types'

async function fetchGenericReport({
  entityName,
  filters = {},
}: GenericReportParams): Promise<GenericReportData> {
  const queryParams = new URLSearchParams()

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value))
    }
  }

  const queryString = queryParams.toString()
  const url = `/v1/reports/generic/${entityName}${queryString ? `?${queryString}` : ''}`

  const response = await fetchWithAuth(url)
  return response.json()
}

export function useGenericReport(params: GenericReportParams, enabled = true) {
  return useQuery({
    queryKey: ['generic-report', params.entityName, params.filters],
    queryFn: () => fetchGenericReport(params),
    enabled,
  })
}
