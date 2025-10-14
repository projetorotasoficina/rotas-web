import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuracao(minutos: number): string {
  const horas = Math.floor(minutos / 60)
  const mins = Math.round(minutos % 60)
  if (horas > 0) {
    return `${horas}h ${mins}min`
  }
  return `${mins}min`
}
