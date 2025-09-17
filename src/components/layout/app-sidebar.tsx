'use client'

import { FileText, Home, Recycle, Settings, Truck, Users } from 'lucide-react'
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

// Dados da sidebar do GeoColeta
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
      title: 'Gestão',
      url: '#',
      icon: Settings,
      isActive: false,
      items: [
        {
          title: 'Incidentes',
          url: '/gestao/incidentes',
        },
      ],
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

  const userData = {
    name: user?.nome || '',
    email: user?.email || '',
    avatar: '/avatars/shadcn.jpg',
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo logo={Recycle} name="GeoColeta" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
