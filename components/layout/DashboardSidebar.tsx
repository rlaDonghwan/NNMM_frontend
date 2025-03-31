'use client'
import {Sidebar, SidebarContent} from '@/components/ui/sidebar'
import Link from 'next/link'
import {RiDashboardFill} from 'react-icons/ri'
import {usePathname} from 'next/navigation'

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="fixed mt-14 w-48 h-full bg-gradient-to-b from-[#88CCE6] to-[#E5E5E5] z-[10]">
      <SidebarContent className="flex flex-col space-y-2 p-4">
        <Link href="/dashboard">
          <button
            className={`flex items-center gap-x-3 px-4 py-2 rounded-md hover:bg-gray-500/30 font-apple ${
              pathname === '/dashboard' ? 'bg-blue-500 text-white' : ''
            }`}>
            <RiDashboardFill className="w-6 h-6" />
            Dashboard
          </button>
        </Link>
        <Link href="/dashboard/environmental">
          <button
            className={`flex items-center gap-x-3 px-4 py-2 rounded-md hover:bg-gray-500/30 font-apple ${
              pathname === '/dashboard/environmental' ? 'bg-blue-500 text-white' : ''
            }`}>
            <img src="/images/E.png" alt="E" className="w-6 h-6" />
            Environment
          </button>
        </Link>
        <Link href="/dashboard/social">
          <button
            className={`flex items-center gap-x-3 px-4 py-2 rounded-md hover:bg-gray-500/30 font-apple ${
              pathname === '/dashboard/social' ? 'bg-blue-500 text-white' : ''
            }`}>
            <img src="/images/S.png" alt="S" className="w-6 h-6" />
            Social
          </button>
        </Link>
        <Link href="/dashboard/governance">
          <button
            className={`flex items-center gap-x-3 px-4 py-2 rounded-md hover:bg-gray-500/30 font-apple ${
              pathname === '/dashboard/governance' ? 'bg-blue-500 text-white' : ''
            }`}>
            <img src="/images/G.png" alt="G" className="w-6 h-6" />
            Governance
          </button>
        </Link>
      </SidebarContent>
    </Sidebar>
  )
}
