/** biome-ignore-all lint/style/noMagicNumbers: não necessário */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { PontoTrajeto } from '@/http/trajeto/types'

type UseRouteAnimationProps = {
  pontos: PontoTrajeto[]
  speed?: number // ms entre pontos
}

export function useRouteAnimation({
  pontos,
  speed = 100,
}: UseRouteAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const currentPoint = pontos[currentIndex]
  const progress =
    pontos.length > 0 ? (currentIndex / (pontos.length - 1)) * 100 : 0

  const play = useCallback(() => {
    if (currentIndex >= pontos.length - 1) {
      setCurrentIndex(0) // Reinicia se chegou ao fim
    }
    setIsPlaying(true)
  }, [currentIndex, pontos.length])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    setCurrentIndex(0)
  }, [])

  const jumpTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < pontos.length) {
        setCurrentIndex(index)
      }
    },
    [pontos.length]
  )

  useEffect(() => {
    if (isPlaying && pontos.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= pontos.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, speed)
    }

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
