import { UserSettingsForm } from '@/components/user-settings/user-settings-form'

export function UserSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">
          Configurações do Usuário
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua conta e defina as preferências de
          e-mail.
        </p>
      </div>

      <UserSettingsForm />
    </div>
  )
}
