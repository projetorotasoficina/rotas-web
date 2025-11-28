import { z } from 'zod'
import { isValidCPF } from './masks'

const NOME_REGEX = /^[a-zA-ZÀ-ÿ\s]+$/

const PLACA_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/

const CNH_CATEGORIA_REGEX = /^(A|B|C|D|E|AB|AC|AD|AE)$/

const COR_HEX_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

// Validadores Zod reutilizáveis
export const validators = {
  // Validação de CPF com dígitos verificadores
  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .refine(isValidCPF, 'CPF inválido'),

  // Validação de CPF opcional
  cpfOptional: z
    .string()
    .optional()
    .refine((val) => !val || isValidCPF(val), 'CPF inválido'),

  email: z.email({ message: 'E-mail inválido' }),

  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .refine((val) => NOME_REGEX.test(val), 'Nome deve conter apenas letras'),

  telefoneOptional: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.replace(/\D/g, '').length >= 10,
      'Telefone deve ter pelo menos 10 dígitos'
    ),

  textoCorto: z
    .string()
    .min(1, 'Campo obrigatório')
    .max(50, 'Máximo de 50 caracteres'),

  textoMedio: z
    .string()
    .min(1, 'Campo obrigatório')
    .max(100, 'Máximo de 100 caracteres'),

  textoLongo: z
    .string()
    .min(1, 'Campo obrigatório')
    .max(255, 'Máximo de 255 caracteres'),

  descricao: z.string().max(500, 'Máximo de 500 caracteres').optional(),

  placa: z
    .string()
    .min(1, 'Placa é obrigatória')
    .transform((val) => val.toUpperCase().replace(/[^A-Z0-9]/g, ''))
    .pipe(
      z
        .string()
        .length(7, 'Placa deve ter 7 caracteres (sem traços)')
        .refine(
          (val) => PLACA_REGEX.test(val),
          'Placa inválida (use formato: ABC1234 ou ABC1D23)'
        )
    ),

  cnhCategoria: z
    .string()
    .optional()
    .refine(
      (val) => !val || CNH_CATEGORIA_REGEX.test(val),
      'Categoria da CNH inválida'
    ),

  dataFutura: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) {
        return true
      }
      const selectedDate = new Date(val)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate > today
    }, 'A data deve ser futura'),

  corHex: z
    .string()
    .min(1, 'Cor é obrigatória')
    .refine(
      (val) => COR_HEX_REGEX.test(val),
      'Cor deve estar no formato hexadecimal (#RRGGBB)'
    ),
}

export const schemas = {
  usuario: z.object({
    nome: validators.nome,
    cpf: validators.cpf,
    email: validators.email,
    telefone: validators.telefoneOptional,
    ativo: z.boolean(),
    roles: z.array(z.enum(['ROLE_SUPER_ADMIN', 'ROLE_ADMIN_CONSULTA'])),
  }),

  motorista: z.object({
    nome: validators.nome,
    cpf: validators.cpf,
    cnhCategoria: validators.cnhCategoria,
    cnhValidade: validators.dataFutura,
    ativo: z.boolean(),
  }),

  caminhao: z.object({
    modelo: validators.textoMedio,
    placa: validators.placa,
    tipoColetaId: z.number().min(1, 'Tipo de coleta é obrigatório'),
    residuoId: z.number().min(1, 'Tipo de resíduo é obrigatório'),
    tipoVeiculo: z.enum(
      [
        'VUC',
        'CAMINHAO_LEVE',
        'CAMINHAO_MEDIO',
        'CAMINHAO_PESADO',
        'CAMINHAO_CARRETA',
      ],
      {
        message: 'Tipo de veículo é obrigatório',
      }
    ),
    ativo: z.boolean(),
  }),

  tipoColeta: z.object({
    nome: validators.textoMedio,
    descricao: validators.descricao,
  }),

  tipoResiduo: z.object({
    nome: validators.textoMedio,
    corHex: validators.corHex,
  }),
}
