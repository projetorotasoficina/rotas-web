'use client'

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type ServerSidePaginationProps = {
  pageCount: number
  totalElements: number
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
}

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  toolbar?: React.ReactNode
  filterColumn?: string
  filterPlaceholder?: string
  onFilterChange?: (value: string) => void
  serverSidePagination?: ServerSidePaginationProps
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  isLoading?: boolean
}

function useTableConfig<TData, TValue>({
  data,
  columns,
  externalSorting,
  externalOnSortingChange,
  serverSidePagination,
}: {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  externalSorting: SortingState | undefined
  externalOnSortingChange: OnChangeFn<SortingState> | undefined
  serverSidePagination: ServerSidePaginationProps | undefined
}) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const sorting = externalSorting ?? internalSorting
  const onSortingChange = externalOnSortingChange ?? setInternalSorting
  const isServerSide = !!serverSidePagination

  return useReactTable({
    data,
    columns,
    onSortingChange,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    ...(isServerSide
      ? {
          manualPagination: true,
          manualSorting: true,
          pageCount: serverSidePagination.pageCount,
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
          getSortedRowModel: getSortedRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
        }),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: serverSidePagination?.onPaginationChange,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      ...(isServerSide && { pagination: serverSidePagination.pagination }),
    },
  })
}

function DataTableImpl<TData, TValue>({
  columns,
  data,
  toolbar,
  filterColumn = 'email',
  filterPlaceholder = 'Filtrar por email...',
  onFilterChange,
  serverSidePagination,
  sorting: externalSorting,
  onSortingChange: externalOnSortingChange,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const isServerSide = !!serverSidePagination

  const table = useTableConfig({
    data,
    columns,
    externalSorting,
    externalOnSortingChange,
    serverSidePagination,
  })

  const getPageNumbers = useCallback(
    (
      currentPage: number,
      pageCount: number
    ): (number | { type: 'ellipsis'; id: string })[] => {
      const pages: (number | { type: 'ellipsis'; id: string })[] = []
      const showEllipsisThreshold = 7

      if (pageCount <= showEllipsisThreshold) {
        for (let i = 0; i < pageCount; i++) {
          pages.push(i)
        }
        return pages
      }

      pages.push(0)

      if (currentPage > 2) {
        pages.push({ type: 'ellipsis', id: 'ellipsis-start' })
      }

      const start = Math.max(1, currentPage - 1)
      const end = Math.min(pageCount - 2, currentPage + 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < pageCount - 3) {
        pages.push({ type: 'ellipsis', id: 'ellipsis-end' })
      }

      pages.push(pageCount - 1)

      return pages
    },
    []
  )

  const renderPageNumbers = useMemo(() => {
    if (!isServerSide) {
      return null
    }

    const currentPage = table.getState().pagination.pageIndex
    const pageCount = table.getPageCount()

    if (pageCount === 0) {
      return null
    }

    const pages = getPageNumbers(currentPage, pageCount)

    return pages.map((page) => {
      if (typeof page === 'object' && page.type === 'ellipsis') {
        return (
          <PaginationItem key={page.id}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      const pageNumber = page as number
      return (
        <PaginationItem key={`page-${pageNumber}`}>
          <PaginationLink
            disabled={isLoading}
            isActive={currentPage === pageNumber}
            onClick={() => table.setPageIndex(pageNumber)}
          >
            {pageNumber + 1}
          </PaginationLink>
        </PaginationItem>
      )
    })
  }, [isServerSide, table, getPageNumbers, isLoading])

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          className="max-w-sm"
          onChange={(event) => {
            const value = event.target.value
            if (onFilterChange) {
              onFilterChange(value)
            } else {
              table.getColumn(filterColumn)?.setFilterValue(value)
            }
          }}
          placeholder={filterPlaceholder}
          value={
            onFilterChange
              ? undefined
              : ((table.getColumn(filterColumn)?.getFilterValue() as string) ??
                '')
          }
        />
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Colunas <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      checked={column.getIsVisible()}
                      className="capitalize"
                      key={column.id}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {toolbar}
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }, (_, i) => `skeleton-${i}`).map(
                (skeletonId) => (
                  <TableRow key={skeletonId}>
                    {columns.map((column) => {
                      const columnId =
                        typeof column === 'object' && 'id' in column
                          ? column.id
                          : `col-${Math.random()}`
                      return (
                        <TableCell key={`${skeletonId}-${columnId}`}>
                          <div className="h-8 w-full animate-pulse rounded bg-muted" />
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              )}
            {!isLoading &&
              table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && 'selected'}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!(isLoading || table.getRowModel().rows?.length) && (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex-1 whitespace-nowrap text-muted-foreground text-sm">
          {isLoading && <span className="animate-pulse">Carregando...</span>}
          {!isLoading &&
            isServerSide &&
            `${serverSidePagination.totalElements} registro(s) encontrado(s).`}
          {!(isLoading || isServerSide) &&
            `${table.getFilteredRowModel().rows.length} registro(s) encontrado(s).`}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={!table.getCanPreviousPage() || isLoading}
                onClick={() => table.previousPage()}
              />
            </PaginationItem>
            {isServerSide && renderPageNumbers}
            <PaginationItem>
              <PaginationNext
                disabled={!table.getCanNextPage() || isLoading}
                onClick={() => table.nextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export const DataTable = memo(DataTableImpl) as typeof DataTableImpl
