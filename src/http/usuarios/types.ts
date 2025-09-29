export type Role = 'ROLE_SUPER_ADMIN' | 'ROLE_ADMIN_CONSULTA'

export type Usuario = {
  id?: number
  nome: string
  cpf: string
  email: string
  telefone?: string
  ativo: boolean
  roles: Role[]
}

export type UsuarioFormData = {
  id?: number
  nome: string
  cpf: string
  email: string
  telefone?: string
  ativo: boolean
  roles: Role[]
}

export type ListUsuariosResponse = Usuario[]

export type CreateUsuarioRequest = UsuarioFormData
export type CreateUsuarioResponse = Usuario

export type UpdateUsuarioRequest = UsuarioFormData
export type UpdateUsuarioResponse = Usuario

export type GetUsuarioResponse = Usuario

export type DeleteUsuarioRequest = { id: number }
