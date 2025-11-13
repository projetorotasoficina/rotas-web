import { QrCode, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { AppTokenDetailsModal } from '@/components/app-tokens/app-token-details-modal'
import { AppTokensTable } from '@/components/app-tokens/app-tokens-table'
import { CodigosAtivacaoTable } from '@/components/codigos-ativacao/codigos-ativacao-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { AppToken } from '@/http/app-tokens/types'

export default function AppAndroidPage() {
  const [selectedToken, setSelectedToken] = useState<AppToken | null>(null)
  const [isTokenDetailsOpen, setIsTokenDetailsOpen] = useState(false)

  const handleViewTokenDetails = (token: AppToken) => {
    setSelectedToken(token)
    setIsTokenDetailsOpen(true)
  }

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

      <AppTokenDetailsModal
        isOpen={isTokenDetailsOpen}
        onClose={handleCloseTokenDetails}
        token={selectedToken}
      />
    </div>
  )
}
