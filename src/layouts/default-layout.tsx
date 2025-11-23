/**
 * @file Layout Padrão da Aplicação.
 * @description Este arquivo define o componente `DefaultLayout`, que serve como a estrutura
 * visual padrão para a maioria das páginas da aplicação após a autenticação.
 *
 * O layout é composto por:
 * - Uma barra lateral de navegação (`AppSidebar`).
 * - Um cabeçalho (`header`) que contém um gatilho para a barra lateral (em telas menores),
 *   o título da página ou breadcrumbs para navegação, e um seletor de tema (dark/light).
 * - A área de conteúdo principal onde o `children` da página é renderizado.
 *
 * Ele utiliza o `SidebarProvider` para gerenciar o estado da barra lateral (aberta/fechada).
 */
import { Link } from 'react-router-dom'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { ModeToggle } from '@/components/layout/mode-toggle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

/**
 * @description Define a estrutura de um item de breadcrumb.
 */
type BreadcrumbItemType = {
  /**
   * O texto a ser exibido no breadcrumb.
   */
  label: string
  /**
   * O link de destino. Se não for fornecido, o item é tratado como a página atual.
   */
  href?: string
}

/**
 * @description Define as propriedades para o componente `DefaultLayout`.
 */
type DefaultLayoutProps = {
  /**
   * O conteúdo da página a ser renderizado dentro do layout.
   */
  children: React.ReactNode
  /**
   * Um título opcional para a página, exibido no cabeçalho se não houver breadcrumbs.
   * @default 'GeoColeta'
   */
  title?: string
  /**
   * Uma lista opcional de itens de breadcrumb para navegação hierárquica.
   * @default []
   */
  breadcrumbs?: BreadcrumbItemType[]
}

/**
 * @description Componente que renderiza a estrutura visual padrão para páginas autenticadas.
 * Ele organiza a barra lateral, o cabeçalho e o conteúdo principal da página.
 * @param {DefaultLayoutProps} props - As propriedades para configurar o layout.
 * @returns {JSX.Element} O layout da página com o conteúdo filho renderizado.
 */
export function DefaultLayout({
  children,
  title = 'GeoColeta',
  breadcrumbs = [],
}: DefaultLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 flex-col gap-1">
            {breadcrumbs.length > 0 ? (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((item, index) => (
                    <div
                      className="flex items-center gap-1"
                      key={`${item.label}-${index}`}
                    >
                      <BreadcrumbItem>
                        {item.href ? (
                          <BreadcrumbLink asChild>
                            <Link to={item.href}>{item.label}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            ) : (
              <h1 className="font-semibold text-lg">{title}</h1>
            )}
          </div>
          <ModeToggle />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
