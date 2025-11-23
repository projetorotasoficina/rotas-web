/**
 * @file Hook para Debounce de Valores.
 * @description Este arquivo contém o hook customizado `useDebounce`, que é utilizado
 * para atrasar a atualização de um valor. É particularmente útil para otimizar o desempenho
 * em situações como campos de busca, onde você quer evitar a execução de operações
 * custosas (ex: requisições de API) a cada pressionar de tecla.
 */
import { useEffect, useState } from 'react'

/**
 * @description Hook que recebe um valor e um atraso (delay), e retorna uma versão
 * "debounced" desse valor. O valor retornado só será atualizado após o `delay`
 * especificado ter passado sem que o valor de entrada tenha sido alterado.
 *
 * @template T - O tipo do valor a ser "debounced".
 * @param {T} value - O valor que você quer "debounce". Geralmente, o estado de um input.
 * @param {number} [delay=500] - O tempo em milissegundos a aguardar antes de atualizar o valor retornado.
 * @returns {T} O valor "debounced", que só reflete a última alteração de `value` após o `delay`.
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Configura um temporizador para atualizar o valor "debounced" após o delay.
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Função de limpeza: cancela o temporizador se o valor mudar antes do delay terminar.
    // Isso garante que apenas o último valor seja definido.
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay]) // Re-executa o efeito se o valor ou o delay mudarem.

  return debouncedValue
}
