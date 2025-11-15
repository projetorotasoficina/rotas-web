/**
 * @file Página de Configurações do Usuário.
 * @description Este arquivo define o componente `UserSettings`, que renderiza a página
 * onde o usuário autenticado pode visualizar e atualizar suas próprias informações de perfil,
 * como nome, e-mail e senha.
 *
 * O componente atua como um contêiner, exibindo um título e uma descrição, e
 * renderiza o componente `UserSettingsForm`, que contém a lógica e os campos do formulário.
 */
import { UserSettingsForm } from "@/components/user-settings/user-settings-form";

/**
 * @description Componente que renderiza a página de configurações do usuário.
 */
export function UserSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações do Usuário</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua conta e defina as preferências de e-mail.
        </p>
      </div>

      <UserSettingsForm />
    </div>
  );
}
