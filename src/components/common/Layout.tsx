import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import React from 'react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from '../ui/navigation-menu'
import {SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar'
import {AppSidebar} from '@/components/dashboard/app-sidebar'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <>
      <NavigationMenu className="flex justify-between min-w-full p-4 bg-white shadow">
        <NavigationMenuList className="text-2xl font-bold">
          <img
            src="/images/Dashboard.png"
            alt="NNMM"
            className="inline-block w-8 h-8 mr-2"
          />
          NNMM
        </NavigationMenuList>
        <NavigationMenuList>
          <Link href="/auth/signin" legacyBehavior passHref>
            <Button className="mr-4">로그아웃</Button>
          </Link>
          <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/118759932?v=4&size=64" />
            <AvatarFallback>CNs</AvatarFallback>
          </Avatar>
        </NavigationMenuList>
      </NavigationMenu>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <main>{children}</main>
      </SidebarProvider>
    </>
  )
}
