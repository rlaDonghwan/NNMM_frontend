import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import React, {useEffect, useState} from 'react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from '../ui/navigation-menu'
import {SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar'
import {AppSidebar} from '@/components/dashboard/AppSidebar'
import {getCookie, deleteCookie} from 'cookies-next'
import {useRouter} from 'next/router'

export default function Layout({children}: {children: React.ReactNode}) {
  const [username, setUsername] = useState('')
  const router = useRouter()

  useEffect(() => {
    const storedUsername = getCookie('username')
    if (storedUsername && typeof storedUsername === 'string') {
      setUsername(storedUsername)
    }
  }, [])

  const handleLogout = () => {
    deleteCookie('token')
    deleteCookie('username')
    router.push('/auth/signin')
  }

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
        <NavigationMenuList className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">{username}</span>
          <Button className="mr-4" onClick={handleLogout}>
            로그아웃
          </Button>
          <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/118759932?v=4&size=64" />
            <AvatarFallback>CNs</AvatarFallback>
          </Avatar>
        </NavigationMenuList>
      </NavigationMenu>
      <SidebarProvider>
        <AppSidebar />
        <main className="">{children}</main>
      </SidebarProvider>
    </>
  )
}
