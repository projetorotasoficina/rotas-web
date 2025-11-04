import { FileText, Home, Recycle, Smartphone, Truck, Users } from 'lucide-react'
import type * as React from 'react'
import { AppLogo } from '@/components/layout/app-logo'
import { NavMain } from '@/components/layout/nav-main'
import { NavProjects } from '@/components/layout/nav-projects'
import { NavUser } from '@/components/layout/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/auth-context'
import { useRole } from '@/hooks/use-role'

const data = {
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: Home,
      isActive: false,
    },
    {
      title: 'Pessoas',
      url: '#',
      icon: Users,
      isActive: false,
      items: [
        {
          title: 'Administradores',
          url: '/pessoas/administradores',
        },
        {
          title: 'Motoristas',
          url: '/pessoas/motoristas',
        },
      ],
    },
    {
      title: 'Operações',
      url: '#',
      icon: Truck,
      isActive: false,
      items: [
        {
          title: 'Caminhões',
          url: '/operacoes/caminhoes',
        },
        {
          title: 'Rotas',
          url: '/operacoes/rotas',
        },
        {
          title: 'Tipos de Coleta',
          url: '/operacoes/tipos-coleta',
        },
        {
          title: 'Tipos de Resíduo',
          url: '/operacoes/tipos-residuo',
        },
      ],
    },
    {
      title: 'App Android',
      url: '/app-android',
      icon: Smartphone,
      isActive: false,
    },
  ],
  projects: [
    {
      name: 'Relatório de Rotas',
      url: '/documentos/relatorio-rotas',
      icon: FileText,
    },
    {
      name: 'Relatório de Incidentes',
      url: '/documentos/relatorio-incidentes',
      icon: FileText,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { isSuperAdmin } = useRole()

  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length === 0) {
      return ''
    }
    const firstInitial = names[0]?.[0] || ''
    const lastInitial = names.length > 1 ? names.at(-1)?.[0] || '' : ''
    return `${firstInitial}${lastInitial}`.toUpperCase()
  }

  const userData = {
    name: user?.nome || '',
    email: user?.email || '',
    initials: getInitials(user?.nome || ''),
  }

  const filteredNavMain = data.navMain
    .filter((section) => {
      if (section.title === 'App Android') {
        return isSuperAdmin()
      }
      return true
    })
    .map((section) => {
      if (section.title === 'Pessoas' && section.items) {
        const filteredItems = section.items.filter((item) => {
          if (item.title === 'Administradores') {
            return isSuperAdmin()
          }
          return true
        })

        return { ...section, items: filteredItems }
      }
      return section
    })
    .filter((section) => {
      if (section.items) {
        return section.items.length > 0
      }
      return true
    })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo logo={Recycle} name="GeoColeta" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
