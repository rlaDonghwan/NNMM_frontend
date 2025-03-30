// components/layout/LogoutButton.tsx
'use client'

import {deleteCookie} from 'cookies-next'
import {useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    deleteCookie('token')
    deleteCookie('username')
    router.push('/signin')
  }

  return (
    <Button onClick={handleLogout} className="mr-3 font-apple text-lg">
      로그아웃
    </Button>
  )
}
