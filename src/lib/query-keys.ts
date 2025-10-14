export const queryKeys = {
  usuarios: {
    all: ['usuarios'] as const,
    detail: (id: number) => ['usuarios', id] as const,
  },
  tipoColeta: {
    all: ['tipo-coleta'] as const,
    detail: (id: number) => ['tipo-coleta', id] as const,
  },
  tipoResiduo: {
    all: ['tipo-residuo'] as const,
    detail: (id: number) => ['tipo-residuo', id] as const,
  },
  trajetos: {
    all: ['trajetos'] as const,
    detail: (id: number) => ['trajetos', id] as const,
    pontos: (id: number) => ['trajeto-pontos', id] as const,
    stats: (from?: Date, to?: Date) =>
      ['trajetos-stats', from?.toISOString(), to?.toISOString()] as const,
    ultimo: ['ultimo-trajeto'] as const,
  },
} as const
