/**
 * @file Hook Genérico para Queries Paginadas.
 * @description Este arquivo contém o hook `usePaginatedQuery`, uma abstração sobre o `useQuery`
 * do TanStack Query, projetada especificamente para lidar com a busca de dados paginados
 * de um endpoint de API. Ele simplifica a configuração de queries paginadas em toda a aplicação.
 */
import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { fetchPaginated } from '@/lib/fetch-paginated'
import type { PageResponse, PaginationParams } from '@/lib/pagination'

/**
 * @description Define as opções para o hook `usePaginatedQuery`.
 * @template T - O tipo de dado esperado em cada item da resposta paginada.
 */
type UsePaginatedQueryOptions<T> = {
  /**
   * A chave de query para o TanStack Query. Deve ser um array único que identifica esta query.
   * Os parâmetros de paginação (`params`) são adicionados automaticamente a esta chave.
   */
  queryKey: readonly unknown[]
  /**
   * O endpoint da API a ser consultado (ex: '/motoristas', '/rotas').
   */
  endpoint: string
  /**
   * Parâmetros de paginação e filtro, como `page`, `size` e `search`.
   */
  params?: PaginationParams
  /**
   * Opções adicionais a serem passadas para o `useQuery` do TanStack Query,
   * permitindo customizações como `enabled`, `staleTime`, etc.
   */
  options?: Omit<UseQueryOptions<PageResponse<T>>, 'queryKey' | 'queryFn'>
}

/**
 * @description Hook customizado para realizar queries paginadas na API.
 * Ele encapsula a lógica de chamar a função `fetchPaginated` com os parâmetros corretos
 * e gerencia o estado da query (loading, error, data) usando `useQuery`.
 *
 * @template T - O tipo de dado dos itens na página.
 * @param {UsePaginatedQueryOptions<T>} options - As opções para configurar a query paginada.
 * @returns O resultado da query do `useQuery`, contendo o estado e os dados paginados.
 */
export function usePaginatedQuery<T>({
  queryKey,
  endpoint,
  params,
  options,
}: UsePaginatedQueryOptions<T>) {
  return useQuery({
    // A chave da query inclui a chave base e os parâmetros para garantir
    // que a query seja refeita quando os parâmetros mudam.
    queryKey: [...queryKey, params],
    // A função da query chama o fetcher de paginação com o endpoint e os parâmetros.
    queryFn: () => fetchPaginated<T>(endpoint, params),
    // Mantém os dados da query anterior visíveis enquanto a nova query está carregando,
    // melhorando a experiência do usuário durante a paginação.
    placeholderData: (previousData) => previousData,
    ...options,
  })
}
