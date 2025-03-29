'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar'
import {Home, Settings} from 'lucide-react'
import Link from 'next/link'

export default function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-bold">NNMM</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <Link href="/dashboard">
                <Home className="mr-2" />
                대시보드
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/mypage/mypage">
                <Settings className="mr-2" />
                마이페이지
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
