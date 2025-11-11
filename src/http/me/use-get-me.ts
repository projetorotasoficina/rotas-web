import { useQuery } from '@tanstack/react-query'
import type { User } from '@/contexts/auth-context'
import { fetchWithAuth } from '@/services/api'

async function getMe(): Promise<User> {
  const response = await fetchWithAuth('/usuarios/meu-perfil')
  const data = await response.json()
  return data
}

export function useGetMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  })
}
