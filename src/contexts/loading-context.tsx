/**
 * @file Contexto de Carregamento Global.
 * @description Este arquivo define um contexto React para gerenciar um estado de carregamento (loading)
 * global na aplicação. Ele permite que múltiplos componentes registrem e desregistrem
 * operações assíncronas, exibindo um indicador de carregamento (como um overlay)
 * enquanto houver pelo menos uma operação em andamento.
 *
 * O `LoadingProvider` deve envolver os componentes que precisam acessar ou controlar
 * o estado de carregamento. O hook `useLoading` fornece acesso ao estado e às funções
 * para iniciar e parar o carregamento.
 */
import { createContext, useCallback, useContext, useState } from 'react'

/**
 * @description Define a estrutura de dados para o contexto de carregamento.
 */
type LoadingContextData = {
  /**
   * `true` se houver uma ou mais operações de carregamento ativas, `false` caso contrário.
   */
  isLoading: boolean
  /**
   * Função para registrar o início de uma operação de carregamento.
   */
  startLoading: () => void
  /**
   * Função para registrar o fim de uma operação de carregamento.
   */
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextData>(
  {} as LoadingContextData
)

type LoadingProviderProps = {
  children: React.ReactNode
}

/**
 * @description Provedor do contexto de carregamento.
 * Mantém um contador de operações de carregamento ativas. O estado `isLoading`
 * é `true` sempre que o contador for maior que zero.
 * @param {LoadingProviderProps} props - Propriedades do provedor.
 * @param {React.ReactNode} props.children - Componentes filhos que terão acesso ao contexto.
 */
export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingCount, setLoadingCount] = useState(0)

  /**
   * @description Incrementa o contador de carregamento. Deve ser chamado antes do início
   * de uma operação assíncrona.
   */
  const startLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1)
  }, [])

  /**
   * @description Decrementa o contador de carregamento. Deve ser chamado após a conclusão
   * (sucesso ou falha) de uma operação assíncrona.
   */
  const stopLoading = useCallback(() => {
    setLoadingCount((prev) => Math.max(0, prev - 1))
  }, [])

  const isLoading = loadingCount > 0

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

/**
 * @description Hook customizado para acessar o contexto de carregamento.
 * Fornece uma maneira fácil para os componentes consumirem o estado `isLoading`
 * e as funções `startLoading` e `stopLoading`.
 * @returns {LoadingContextData} O objeto de contexto de carregamento.
 * @throws {Error} Lança um erro se o hook for usado fora de um `LoadingProvider`.
 */
export function useLoading() {
  const context = useContext(LoadingContext)

  if (!context) {
    throw new Error('useLoading deve ser usado dentro de um LoadingProvider')
  }

  return context
}
