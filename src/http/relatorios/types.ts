export type GenericReportParams = {
  entityName: string
  filters?: Record<string, string | number | boolean>
}

export type GenericReportData = Record<string, unknown>[]

export type ExportFormat = 'pdf' | 'excel'

export type ExportOptions = {
  filename: string
  title: string
  columns?: {
    key: string
    label: string
  }[]
  totalRecords?: number
}
