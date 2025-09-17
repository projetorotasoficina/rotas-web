'use client'

import type * as React from 'react'
import { useNavigate } from 'react-router-dom'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

type AppLogoProps = {
  name: string
  logo: React.ElementType
  subtitle?: string
}

export function AppLogo({ name, logo: LogoIcon, subtitle }: AppLogoProps) {
  const navigate = useNavigate()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => navigate('/')}
          size="lg"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-white">
            <LogoIcon className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{name}</span>
            {subtitle && (
              <span className="truncate text-sidebar-foreground/70 text-xs">
                {subtitle}
              </span>
            )}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
