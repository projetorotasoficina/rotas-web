import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavProjects({
  sections,
}: {
  sections: {
    label: string
    items: {
      name: string
      url: string
      icon: LucideIcon
    }[]
  }[]
}) {
  return (
    <>
      {sections.map((section) => (
        <SidebarGroup
          className="group-data-[collapsible=icon]:hidden"
          key={section.label}
        >
          <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
