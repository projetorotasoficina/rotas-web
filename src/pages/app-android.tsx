/**
 * @file Página de Gerenciamento do App Android.
 * @description Este arquivo define o componente `AppAndroidPage`, que fornece uma interface
 * para gerenciar o acesso e os dispositivos do aplicativo móvel Android. A página é
 * dividida em duas seções principais usando abas (`Tabs`):
 *
 * 1.  **Códigos de Ativação**:
 *     - Exibe uma tabela (`CodigosAtivacaoTable`) com os códigos de uso único gerados
 *       para registrar novos dispositivos.
 *     - Permite a geração, revogação e exclusão desses códigos.
 *
 * 2.  **Tokens Ativos**:
 *     - Mostra uma tabela (`AppTokensTable`) com os tokens de longa duração que foram
 *       gerados a partir de um código de ativação.
 *     - Esses tokens representam os dispositivos registrados e autorizados a se comunicar
 *       com a API.
 *     - Permite visualizar detalhes, revogar ou reativar o acesso de um dispositivo.
 *
 * O componente também gerencia a abertura de um modal (`AppTokenDetailsModal`) para exibir
 * informações detalhadas de um token selecionado.
 */
import { QrCode, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { AppTokenDetailsModal } from '@/components/app-tokens/app-token-details-modal'
import { AppTokensTable } from '@/components/app-tokens/app-tokens-table'
import { CodigosAtivacaoTable } from '@/components/codigos-ativacao/codigos-ativacao-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { AppToken } from '@/http/app-tokens/types'

/**
 * @description Componente que renderiza a página de gerenciamento do App Android.
 */
export function AppAndroidPage() {
  // Estados para controlar o modal de detalhes do token.
  const [selectedToken, setSelectedToken] = useState<AppToken | null>(null)
  const [isTokenDetailsOpen, setIsTokenDetailsOpen] = useState(false)

  /**
   * @description Abre o modal de detalhes para um token específico.
   * @param {AppToken} token - O token a ser visualizado.
   */
  const handleViewTokenDetails = (token: AppToken) => {
    setSelectedToken(token)
    setIsTokenDetailsOpen(true)
  }

  /**
   * @description Fecha o modal de detalhes do token e limpa o estado.
   */
  const handleCloseTokenDetails = () => {
    setIsTokenDetailsOpen(false)
    setSelectedToken(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Gerenciar App Android</h1>
      </div>

      <Tabs className="w-full" defaultValue="codigos">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger className="gap-2" value="codigos">
            <QrCode className="h-4 w-4" />
            Códigos de Ativação
          </TabsTrigger>
          <TabsTrigger className="gap-2" value="tokens">
            <Smartphone className="h-4 w-4" />
            Tokens Ativos
          </TabsTrigger>
        </TabsList>

        {/* Aba para gerenciar Códigos de Ativação */}
        <TabsContent className="space-y-4" value="codigos">
          <div className="rounded-lg border bg-card p-4 text-card-foreground">
            <h3 className="font-semibold text-sm">Sobre Códigos de Ativação</h3>
            <p className="text-muted-foreground text-sm">
              Códigos de ativação são usados para registrar novos dispositivos
              Android. Cada código pode ser usado apenas uma vez e fica
              vinculado ao dispositivo que o utilizou.
            </p>
          </div>
          <CodigosAtivacaoTable />
        </TabsContent>

        {/* Aba para gerenciar Tokens Ativos */}
        <TabsContent className="space-y-4" value="tokens">
          <div className="rounded-lg border bg-card p-4 text-card-foreground">
            <h3 className="font-semibold text-sm">Sobre Tokens Ativos</h3>
            <p className="text-muted-foreground text-sm">
              Tokens são gerados automaticamente quando um código de ativação é
              usado. Eles permitem que o dispositivo acesse a API de forma
              permanente. Você pode revogar ou reativar tokens conforme
              necessário.
            </p>
          </div>
          <AppTokensTable onViewDetails={handleViewTokenDetails} />
        </TabsContent>
      </Tabs>

      {/* Modal para exibir detalhes de um token */}
      <AppTokenDetailsModal
        isOpen={isTokenDetailsOpen}
        onClose={handleCloseTokenDetails}
        token={selectedToken}
      />
    </div>
  )
}
