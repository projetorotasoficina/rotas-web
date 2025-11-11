import { HttpResponse, http } from 'msw'
import { apiConfig } from '@/services/api'

export const handlers = [
  http.get(`*${apiConfig.endpoints.usuarios.list}`, () => {
    return HttpResponse.json({
      content: [
        {
          id: '1',
          nome: 'Admin Teste 1',
          email: 'admin1@test.com',
          cpf: '111.111.111-11',
          telefone: '11987654321',
          roles: ['ROLE_ADMIN_CONSULTA'],
          ativo: true,
        },
        {
          id: '2',
          nome: 'Admin Teste 2',
          email: 'admin2@test.com',
          cpf: '222.222.222-22',
          telefone: '22987654321',
          roles: ['ROLE_SUPER_ADMIN'],
          ativo: false,
        },
      ],
      totalPages: 1,
      totalElements: 2,
    })
  }),

  http.get(
    new RegExp(`.*${apiConfig.endpoints.caminhoes.list}(\\?.*)?`),
    () => {
      return HttpResponse.json({
        content: [
          {
            id: '1',
            modelo: 'Volvo VM 260',
            placa: 'ABC-1234',
            tipoColetaId: 1,
            residuoId: 1,
            ativo: true,
          },
          {
            id: '2',
            modelo: 'Scania R450',
            placa: 'DEF-5678',
            tipoColetaId: 2,
            residuoId: 2,
            ativo: false,
          },
        ],
        totalPages: 1,
        totalElements: 2,
      })
    }
  ),

  http.get(`*${apiConfig.endpoints.tipoColeta.list}`, () => {
    return HttpResponse.json([
      { id: 1, nome: 'Seletiva' },
      { id: 2, nome: 'Orgânica' },
    ])
  }),

  http.get(`*${apiConfig.endpoints.tipoResiduo.list}`, () => {
    return HttpResponse.json([
      { id: 1, nome: 'Reciclável' },
      { id: 2, nome: 'Comum' },
    ])
  }),
]
