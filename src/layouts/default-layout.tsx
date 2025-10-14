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

type BreadcrumbItemType = {
  label: string
  href?: string
}

type DefaultLayoutProps = {
  children: React.ReactNode
  title?: string
  breadcrumbs?: BreadcrumbItemType[]
}

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
