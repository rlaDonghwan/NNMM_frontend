// components/layout/Header.tsx
'use client'

import Link from 'next/link'
import {RiDashboardFill} from 'react-icons/ri'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink
} from '@/components/ui/navigation-menu'

//메인 페이지 헤더
export default function MainHeader() {
  return (
    <NavigationMenu className="fixed justify-start min-w-full p-4 bg-white shadow-lg h-14">
      <NavigationMenuList className="text-2xl font-bold">
        <NavigationMenuLink className="flex flex-row items-center font-apple" href="/">
          <RiDashboardFill className="mr-2" />
          NNMM
        </NavigationMenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
