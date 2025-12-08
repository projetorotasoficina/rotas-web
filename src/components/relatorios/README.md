# Sistema de Relatórios e Exportação

Este módulo fornece infraestrutura completa para geração e exportação de relatórios em PDF e Excel.

## Componentes

### ExportButton

Componente genérico que adiciona funcionalidade de exportação a qualquer conjunto de dados.

**Props:**
- `data`: Array de objetos com os dados a serem exportados
- `options`: Configurações de exportação (título, nome do arquivo, colunas)
- `disabled`: Desabilita o botão (opcional)
- `size`: Tamanho do botão (opcional)
- `variant`: Variante do botão (opcional)

**Exemplo de uso básico:**

```tsx
import { ExportButton } from '@/components/relatorios'

function MinhaTabela() {
  const data = [
    { id: 1, nome: 'João', email: 'joao@example.com' },
    { id: 2, nome: 'Maria', email: 'maria@example.com' },
  ]

  return (
    <div>
      <ExportButton
        data={data}
        options={{
          filename: 'usuarios',
          title: 'Relatório de Usuários',
        }}
      />
    </div>
  )
}
```

**Exemplo com colunas customizadas:**

```tsx
<ExportButton
  data={trajetos}
  options={{
    filename: 'trajetos-dezembro',
    title: 'Relatório de Trajetos - Dezembro 2024',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'motoristaId', label: 'Motorista' },
      { key: 'dataInicio', label: 'Data Início' },
      { key: 'distanciaTotal', label: 'Distância (km)' },
      { key: 'status', label: 'Status' },
    ],
  }}
/>
```

## Hooks

### useGenericReport

Hook para buscar dados do endpoint genérico de relatórios da API.

**Parâmetros:**
- `entityName`: Nome da entidade (ex: 'trajeto', 'motorista', 'caminhao')
- `filters`: Objeto com filtros dinâmicos (opcional)
- `enabled`: Habilita/desabilita a query (opcional)

**Exemplo:**

```tsx
import { useGenericReport } from '@/http/relatorios'

function RelatorioTrajetos() {
  const { data, isLoading } = useGenericReport({
    entityName: 'trajeto',
    filters: {
      status: 'FINALIZADO',
      'dataInicio>=': '2024-12-01',
    },
  })

  if (isLoading) return <div>Carregando...</div>

  return (
    <div>
      <ExportButton
        data={data || []}
        options={{
          filename: 'trajetos-finalizados',
          title: 'Trajetos Finalizados',
        }}
      />
    </div>
  )
}
```

## Utilitários de Exportação

### exportToPDF

Gera um arquivo PDF a partir de dados tabulares.

**Características:**
- Layout paisagem A4
- Header com título e data de geração
- Footer com numeração de páginas
- Auto-detecção de colunas
- Formatação automática de valores (datas, booleanos, números)
- Linhas zebradas para melhor legibilidade

### exportToExcel

Gera um arquivo Excel (.xlsx) a partir de dados tabulares.

**Características:**
- Título formatado
- Data de geração
- Auto-ajuste de largura de colunas
- Headers destacados
- Formatação automática de valores

## Filtros Disponíveis na API

O endpoint `/api/v1/reports/generic/{entityName}` suporta filtros dinâmicos:

**Operadores:**
- `campo=valor` - Igualdade
- `campo>=valor` - Maior ou igual
- `campo<=valor` - Menor ou igual
- `campo.relacionamento=valor` - Filtro em relacionamento

**Exemplos de filtros:**

```tsx
// Trajetos finalizados
{ status: 'FINALIZADO' }

// Trajetos de dezembro
{
  'dataInicio>=': '2024-12-01',
  'dataInicio<=': '2024-12-31'
}

// Caminhões ativos de um tipo específico
{
  ativo: true,
  'tipoResiduo.nome': 'Reciclável'
}

// Incidentes de uma rota
{
  'trajeto.rotaId': 5
}
```

## Entidades Disponíveis

As seguintes entidades estão mapeadas no endpoint genérico:

- `caminhao`
- `incidente`
- `motorista`
- `rota`
- `tipoColeta`
- `tipoResiduo`
- `trajeto`
- `usuario`

## Exemplo Completo: Relatório com Filtros

```tsx
import { useState } from 'react'
import { useGenericReport } from '@/http/relatorios'
import { ExportButton } from '@/components/relatorios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function RelatorioTrajetosPorPeriodo() {
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [filtrosAtivos, setFiltrosAtivos] = useState({})

  const { data, isLoading } = useGenericReport(
    {
      entityName: 'trajeto',
      filters: filtrosAtivos,
    },
    Object.keys(filtrosAtivos).length > 0
  )

  const handleAplicarFiltros = () => {
    setFiltrosAtivos({
      status: 'FINALIZADO',
      ...(dataInicio && { 'dataInicio>=': dataInicio }),
      ...(dataFim && { 'dataFim<=': dataFim }),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          placeholder="Data Início"
        />
        <Input
          type="date"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          placeholder="Data Fim"
        />
        <Button onClick={handleAplicarFiltros}>
          Aplicar Filtros
        </Button>
      </div>

      {isLoading && <div>Carregando dados...</div>}

      {data && (
        <>
          <div>Total de registros: {data.length}</div>
          <ExportButton
            data={data}
            options={{
              filename: `trajetos-${dataInicio}-${dataFim}`,
              title: 'Relatório de Trajetos',
              columns: [
                { key: 'id', label: 'ID' },
                { key: 'rotaId', label: 'Rota' },
                { key: 'motoristaId', label: 'Motorista' },
                { key: 'dataInicio', label: 'Início' },
                { key: 'dataFim', label: 'Fim' },
                { key: 'distanciaTotal', label: 'Distância (m)' },
                { key: 'status', label: 'Status' },
              ],
            }}
          />
        </>
      )}
    </div>
  )
}
```

## Próximos Passos

A infraestrutura está pronta para:

1. **Fase 2**: Adicionar botão de exportação em todas as telas CRUD
2. **Fase 3**: Criar página `/relatorios` com relatórios especializados
3. **Fase 4**: Adicionar filtros avançados e visualizações

## Notas Técnicas

- Os dados são processados no cliente (frontend)
- Colunas sensíveis (password, token) são automaticamente filtradas
- Valores null/undefined são exibidos como "-"
- Objetos aninhados são formatados automaticamente
- Números decimais são arredondados para 2 casas no PDF
