import { format } from 'date-fns'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logoImg from '@/assets/logo.png'
import type { ExportOptions, GenericReportData } from '@/http/relatorios/types'

export function exportToPDF(data: GenericReportData, options: ExportOptions) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  // Add logo (square proportions)
  const logoSize = 20
  doc.addImage(logoImg, 'PNG', 14, 8, logoSize, logoSize)

  // Header
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(options.title, 40, 15)

  // Subtitle with date and total records
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const dateStr = format(new Date(), 'dd/MM/yyyy HH:mm')
  doc.text(`Gerado em: ${dateStr}`, 40, 21)

  const totalRecords = options.totalRecords ?? data.length
  doc.text(`Total de registros: ${totalRecords}`, 40, 26)

  if (data.length === 0) {
    doc.setFontSize(12)
    doc.text('Nenhum dado encontrado para os filtros aplicados.', 14, 35)
  } else {
    // Auto-detect columns if not provided
    const columns = options.columns || autoDetectColumns(data)

    // Extract table data
    const tableData = data.map((row) =>
      columns.map((col) => formatCellValue(row[col.key], col.key))
    )

    // Generate table
    autoTable(doc, {
      startY: 33,
      head: [columns.map((col) => col.label)],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 28, left: 14, right: 14 },
    })
  }

  // Footer with page numbers
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  // Download
  doc.save(`${options.filename}.pdf`)
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
function formatCellValue(value: unknown, key?: string): string {
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
  if (typeof value === 'number') {
    // Format numbers with 2 decimals if float
    return value % 1 === 0 ? String(value) : value.toFixed(2)
  }
  return String(value)
}
