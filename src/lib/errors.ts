export class ApiError extends Error {
  status: number
  userMessage: string
  technicalDetails?: string

  constructor(status: number, userMessage: string, technicalDetails?: string) {
    super(userMessage)
    this.name = 'ApiError'
    this.status = status
    this.userMessage = userMessage
    this.technicalDetails = technicalDetails
  }
}

export function getErrorMessage(
  status: number,
  defaultMessage?: string
): string {
  switch (status) {
    case 400:
      return 'Dados inválidos. Verifique as informações enviadas.'
    case 401:
      return 'Sessão expirada. Faça login novamente.'
    case 403:
      return 'Você não tem permissão para acessar este recurso.'
    case 404:
      return 'Recurso não encontrado.'
    case 409:
      return 'Conflito: este recurso já existe ou está em uso.'
    case 422:
      return 'Dados inválidos. Verifique os campos obrigatórios.'
    case 500:
      return 'Erro no servidor. Tente novamente mais tarde.'
    case 503:
      return 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.'
    default:
      return defaultMessage || 'Erro ao processar requisição. Tente novamente.'
  }
}
