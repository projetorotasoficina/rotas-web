
export type Motorista = {
  id?: number
  nome: string
  cpf: string
  cnhCategoria?: string
  cnhValidade?: string // Using string to handle date input
  ativo: boolean
}

export type MotoristaFormData = {
  id?: number
  nome: string
  cpf: string
  cnhCategoria?: string
  cnhValidade?: string
  ativo: boolean
}

export type ListMotoristasResponse = Motorista[]

export type CreateMotoristaRequest = MotoristaFormData
export type CreateMotoristaResponse = Motorista

export type UpdateMotoristaRequest = MotoristaFormData
export type UpdateMotoristaResponse = Motorista

export type GetMotoristaResponse = Motorista

export type DeleteMotoristaRequest = { id: number }
