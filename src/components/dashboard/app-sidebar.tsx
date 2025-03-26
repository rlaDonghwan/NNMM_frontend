import {
  SidebarInset,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader
} from '@/components/ui/sidebar'

export function AppSidebar() {
  return (
    <SidebarInset
      style={{
        background: 'linear-gradient(to bottom, #88CCE6, #E5E5E5 95%)',
        maxWidth: '200px'
      }}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </SidebarInset>
  )
}
