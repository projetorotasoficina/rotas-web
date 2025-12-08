import { useState } from 'react'
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

export function useLazyGenericReport() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchReport = async (
    params: GenericReportParams
  ): Promise<GenericReportData> => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchGenericReport(params)
      return data
    } catch (err) {
      const fetchError =
        err instanceof Error ? err : new Error('Erro desconhecido')
      setError(fetchError)
      throw fetchError
    } finally {
      setIsLoading(false)
    }
  }

  return {
    fetchReport,
    isLoading,
    error,
  }
}
