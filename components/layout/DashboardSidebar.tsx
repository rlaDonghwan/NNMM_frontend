'use client'
import {Sidebar, SidebarContent} from '@/components/ui/sidebar'
import {useSidebar} from '@/components/ui/sidebar'
import Link from 'next/link'
import {RiDashboardFill} from 'react-icons/ri'
import {usePathname} from 'next/navigation'
import React from 'react'

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="fixed mt-14 h-full z-[10]">
      <SidebarContent className="flex flex-col space-y-2 p-3">
        <Link href="/dashboard">
          <button className="flex flex-row w-full items-center space-x-10">
            <RiDashboardFill className="fixed w-6 h-6" />
            <span
              className={`flex gap-x-3 p-2 rounded-md w-[110px] hover:bg-gray-500/30 font-apple ${
                pathname === '/dashboard' ? 'bg-blue-500 text-white' : ''
              }`}>
              Dashboard
            </span>
          </button>
        </Link>
        <Link href="/dashboard/environmental">
          <button className="flex flex-row w-full items-center space-x-4">
            <img src="/images/E.png" alt="E" className="w-6 h-6" />
            <span
              className={`flex items-center gap-x-3 p-2 rounded-md w-[110px] hover:bg-gray-500/30 font-apple ${
                pathname === '/dashboard/environmental' ? 'bg-blue-500 text-white' : ''
              }`}>
              Environment
            </span>
          </button>
        </Link>
        <Link href="/dashboard/social">
          <button className="flex flex-row w-full items-center space-x-4">
            <img src="/images/S.png" alt="S" className="w-6 h-6" />
            <span
              className={`flex items-center gap-x-3 p-2 rounded-md w-[110px] hover:bg-gray-500/30 font-apple ${
                pathname === '/dashboard/social' ? 'bg-blue-500 text-white' : ''
              }`}>
              Social
            </span>
          </button>
        </Link>
        <Link href="/dashboard/governance">
          <button className="flex flex-row w-full items-center space-x-4">
            <img src="/images/G.png" alt="G" className="w-6 h-6" />
            <span
              className={`flex items-center gap-x-3 p-2 rounded-xl w-[110px] hover:bg-gray-500/30 font-apple ${
                pathname === '/dashboard/governance' ? 'bg-blue-500 text-white' : ''
              }`}>
              Governance
            </span>
          </button>
        </Link>
      </SidebarContent>
    </Sidebar>
  )
}
