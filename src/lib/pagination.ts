export type PageableSort = {
  sorted: boolean
  unsorted: boolean
  empty: boolean
}

export type Pageable = {
  pageNumber: number
  pageSize: number
  sort: PageableSort
  offset: number
  paged: boolean
  unpaged: boolean
}

export type PageResponse<T> = {
  content: T[]
  pageable: Pageable
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  size: number
  number: number
  numberOfElements: number
  empty: boolean
  sort: PageableSort
}

export type PaginationParams = {
  page?: number
  size?: number
  order?: string
  asc?: boolean
  search?: string
}

export type PaginationState = {
  pageIndex: number
  pageSize: number
}
