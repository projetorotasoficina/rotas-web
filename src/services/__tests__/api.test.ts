import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/lib/errors'
import { server } from '@/mocks/server'
import { fetchWithAuth, fetchWithoutAuth } from '@/services/api'

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchWithoutAuth', () => {
    it('should return data on successful response', async () => {
      const mockData = { message: 'Success' }
      server.use(
        http.get('*/test', () => {
          return HttpResponse.json(mockData)
        })
      )

      const response = await fetchWithoutAuth('/test')
      expect(response).toEqual(mockData)
    })

    it('should throw ApiError with correct message for 404', async () => {
      server.use(
        http.get('*/test', () => {
          return HttpResponse.json({ erro: 'Not Found' }, { status: 404 })
        })
      )

      await expect(fetchWithoutAuth('/test')).rejects.toThrow(ApiError)
      await expect(fetchWithoutAuth('/test')).rejects.toThrow(
        'Recurso não encontrado.'
      )
    })

    it('should throw ApiError with correct message for 500', async () => {
      server.use(
        http.get('*/test', () => {
          return HttpResponse.json(
            { erro: 'Internal Server Error' },
            { status: 500 }
          )
        })
      )

      await expect(fetchWithoutAuth('/test')).rejects.toThrow(ApiError)
      await expect(fetchWithoutAuth('/test')).rejects.toThrow(
        'Erro no servidor. Tente novamente mais tarde.'
      )
    })
  })

  describe('fetchWithAuth', () => {
    it('should return data on successful response', async () => {
      const mockData = { message: 'Success' }
      server.use(
        http.get('*/test', () => {
          return HttpResponse.json(mockData)
        })
      )

      const response = await fetchWithAuth('/test')
      const data = await response.json()
      expect(data).toEqual(mockData)
    })

    it('should throw ApiError with correct message for 401', async () => {
      server.use(
        http.get('*/test', () => {
          return HttpResponse.json({}, { status: 401 })
        })
      )

      await expect(fetchWithAuth('/test')).rejects.toThrow(ApiError)
      await expect(fetchWithAuth('/test')).rejects.toThrow(
        'Sessão expirada. Faça login novamente.'
      )
    })
  })
})
