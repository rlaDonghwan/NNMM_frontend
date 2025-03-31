// components/layout/Header.tsx
'use client'

import Link from 'next/link'
import {RiDashboardFill} from 'react-icons/ri'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink
} from '@/components/ui/navigation-menu'
import LogoutButton from './LogoutButton'
import UserAvatar from './UserAvatar'

// 대시보드 페이지 헤더
export default function DashboardHeader() {
  return (
    <NavigationMenu className="flex flex-row justify-between min-w-full p-4 bg-white shadow-lg h-14">
      <NavigationMenuList className="text-2xl font-bold">
        <NavigationMenuLink className="flex flex-row items-center font-apple" href="/">
          <RiDashboardFill className="mr-2" />
          NNMM
        </NavigationMenuLink>
      </NavigationMenuList>
      <NavigationMenuList className="flex items-center space-x-4">
        <LogoutButton />
        <Link href="/mypage">
          <UserAvatar />
        </Link>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
