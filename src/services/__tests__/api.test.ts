import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/lib/errors'
import { fetchWithAuth, fetchWithoutAuth } from '@/services/api'

global.fetch = vi.fn()

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchWithoutAuth', () => {
    it('should return data on successful response', async () => {
      const mockData = { message: 'Success' }
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      }
      ;(fetch as any).mockResolvedValue(mockResponse)

      const response = await fetchWithoutAuth('/test')
      expect(response).toEqual(mockData)
    })

    it('should throw ApiError with correct message for 404', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: () => Promise.resolve({ erro: 'Not Found' }),
      }
      ;(fetch as any).mockResolvedValue(mockResponse)

      await expect(fetchWithoutAuth('/test')).rejects.toThrow(ApiError)
      await expect(fetchWithoutAuth('/test')).rejects.toThrow(
        'Recurso não encontrado.'
      )
    })

    it('should throw ApiError with correct message for 500', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: () => Promise.resolve({ erro: 'Internal Server Error' }),
      }
      ;(fetch as any).mockResolvedValue(mockResponse)

      await expect(fetchWithoutAuth('/test')).rejects.toThrow(ApiError)
      await expect(fetchWithoutAuth('/test')).rejects.toThrow(
        'Erro no servidor. Tente novamente mais tarde.'
      )
    })
  })

  describe('fetchWithAuth', () => {
    it('should return data on successful response', async () => {
      const mockData = { message: 'Success' }
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      }
      ;(fetch as any).mockResolvedValue(mockResponse)

      const response = await fetchWithAuth('/test')
      const data = await response.json()
      expect(data).toEqual(mockData)
    })

    it('should throw ApiError with correct message for 401', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        json: () => Promise.resolve({}),
      }
      ;(fetch as any).mockResolvedValue(mockResponse)

      await expect(fetchWithAuth('/test')).rejects.toThrow(ApiError)
      await expect(fetchWithAuth('/test')).rejects.toThrow(
        'Sessão expirada. Faça login novamente.'
      )
    })
  })
})
