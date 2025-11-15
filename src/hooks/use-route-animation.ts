/**
 * @file Hook para Animação de Rotas em Mapa.
 * @description Este arquivo contém o hook `useRouteAnimation`, projetado para controlar
 * a animação de uma sequência de pontos de uma rota (trajeto) em um mapa.
 * Ele gerencia o estado da animação, como o ponto atual, o progresso e se a
 * animação está em execução, e fornece controles como play, pause e reset.
 */
/** biome-ignore-all lint/style/noMagicNumbers: não necessário */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { PontoTrajeto } from '@/http/trajeto/types'

/**
 * @description Define as propriedades para o hook `useRouteAnimation`.
 */
type UseRouteAnimationProps = {
  /**
   * Uma lista de pontos do trajeto a serem animados.
   */
  pontos: PontoTrajeto[]
  /**
   * A velocidade da animação em milissegundos entre cada ponto.
   * @default 100
   */
  speed?: number
}

/**
 * @description Hook para gerenciar a animação de uma rota em um mapa.
 * Ele itera sobre uma lista de pontos de trajeto em um intervalo de tempo definido,
 * permitindo que a UI renderize o progresso da rota de forma animada.
 *
 * @param {UseRouteAnimationProps} props - As propriedades para configurar a animação.
 * @returns Um objeto contendo:
 * - `currentIndex`: O índice do ponto atual na lista de `pontos`.
 * - `currentPoint`: O objeto do ponto atual.
 * - `progress`: O progresso da animação como uma porcentagem (0 a 100).
 * - `isPlaying`: Um booleano indicando se a animação está em execução.
 * - `totalPoints`: O número total de pontos na rota.
 * - `play`: Função para iniciar ou retomar a animação.
 * - `pause`: Função para pausar a animação.
 * - `reset`: Função para parar a animação e voltar ao ponto inicial.
 * - `jumpTo`: Função para pular para um índice específico da animação.
 */
export function useRouteAnimation({
  pontos,
  speed = 100,
}: UseRouteAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentPoint = pontos[currentIndex]
  const progress =
    pontos.length > 0 ? (currentIndex / (pontos.length - 1)) * 100 : 0

  /**
   * @description Inicia ou retoma a animação. Se a animação já terminou, ela reinicia do começo.
   */
  const play = useCallback(() => {
    if (currentIndex >= pontos.length - 1) {
      setCurrentIndex(0) // Reinicia se chegou ao fim
    }
    setIsPlaying(true)
  }, [currentIndex, pontos.length])

  /**
   * @description Pausa a animação no ponto atual.
   */
  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  /**
   * @description Para a animação e redefine o índice para o início.
   */
  const reset = useCallback(() => {
    setIsPlaying(false)
    setCurrentIndex(0)
  }, [])

  /**
   * @description Pula para um ponto específico na animação.
   * @param {number} index - O índice do ponto para o qual pular.
   */
  const jumpTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < pontos.length) {
        setCurrentIndex(index)
      }
    },
    [pontos.length]
  )

  /**
   * Efeito que gerencia o `setInterval` para a animação.
   * O intervalo é criado quando `isPlaying` é `true` e limpo quando é `false`
   * ou quando o componente é desmontado.
   */
  useEffect(() => {
    if (isPlaying && pontos.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          // Para a animação se chegar ao último ponto.
          if (prev >= pontos.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, speed)
    }

    // Função de limpeza para o efeito.
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, pontos.length, speed])

  return {
    currentIndex,
    currentPoint,
    progress,
    isPlaying,
    totalPoints: pontos.length,
    play,
    pause,
    reset,
    jumpTo,
  }
}
