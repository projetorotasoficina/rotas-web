import { format } from 'date-fns'
// biome-ignore lint/performance/noNamespaceImport: XLSX library requires namespace import
import * as XLSX from 'xlsx'
import type { ExportOptions, GenericReportData } from '@/http/relatorios/types'

export function exportToExcel(data: GenericReportData, options: ExportOptions) {
  // Create workbook
  const wb = XLSX.utils.book_new()

  if (data.length === 0) {
    // Empty sheet with message
    const ws = XLSX.utils.aoa_to_sheet([
      [options.title],
      [],
      ['Nenhum dado encontrado para os filtros aplicados.'],
    ])
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório')
  } else {
    // Auto-detect columns if not provided
    const columns = options.columns || autoDetectColumns(data)

    // Prepare data with headers
    const headers = columns.map((col) => col.label)
    const rows = data.map((row) =>
      columns.map((col) => formatCellValue(row[col.key], col.key))
    )

    const totalRecords = options.totalRecords ?? data.length

    // Create worksheet
    const wsData = [
      [options.title],
      [`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`],
      [`Total de registros: ${totalRecords}`],
      [],
      headers,
      ...rows,
    ]

    const ws = XLSX.utils.aoa_to_sheet(wsData)

    // Set column widths
    const colWidths = columns.map((col) => {
      const maxLength = Math.max(
        col.label.length,
        ...data
          .map((row) => String(formatCellValue(row[col.key], col.key)).length)
          .slice(0, 100) // Sample first 100 rows for performance
      )
      return { wch: Math.min(maxLength + 2, 50) }
    })
    ws['!cols'] = colWidths

    // Merge title cells
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: columns.length - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: columns.length - 1 } },
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Relatório')
  }

  // Download
  XLSX.writeFile(wb, `${options.filename}.xlsx`)
}

function autoDetectColumns(data: GenericReportData) {
  if (data.length === 0) {
    return []
  }

  const firstRow = data[0]
  return Object.keys(firstRow)
    .filter((key) => !shouldSkipColumn(key))
    .map((key) => ({
      key,
      label: formatColumnLabel(key),
    }))
}

function shouldSkipColumn(key: string): boolean {
  const skipKeys = ['password', 'senha', 'token', 'createdAt', 'updatedAt']
  return skipKeys.some((skip) => key.toLowerCase().includes(skip.toLowerCase()))
}

function formatColumnLabel(key: string): string {
  // Convert camelCase to Title Case
  return (
    key
      .replace(/([A-Z])/g, ' $1')
      // biome-ignore lint/performance/useTopLevelRegex: não necessário
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  )
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Function handles multiple type checks which are necessary for correct formatting
function formatCellValue(
  value: unknown,
  key?: string
): string | number | boolean {
  if (value === null || value === undefined) {
    return '-'
  }

  // Special handling for 'ativo' field
  if (typeof value === 'boolean') {
    if (key === 'ativo') {
      return value ? 'Ativo' : 'Inativo'
    }
    return value ? 'Sim' : 'Não'
  }

  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'object') {
    // Handle nested objects (e.g., { id: 1, nome: "Test" } -> "Test")
    if ('nome' in value) {
      return String(value.nome)
    }
    if ('name' in value) {
      return String(value.name)
    }
    return JSON.stringify(value)
  }
  return String(value)
}
