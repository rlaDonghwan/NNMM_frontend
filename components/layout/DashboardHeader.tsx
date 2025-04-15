'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {RiDashboardFill} from 'react-icons/ri'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink
} from '@/components/ui/navigation-menu'
import LogoutButton from './LogoutButton'
import {fetchCurrentUser} from '@/services/auth' // 사용자 정보 가져오기

// 대시보드 페이지 헤더
export default function DashboardHeader() {
  const [user, setUser] = useState<any>(null) // 사용자 상태
  const [isLoading, setIsLoading] = useState(true) // 로딩 상태

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await fetchCurrentUser() // 사용자 정보 API 호출
        setUser(currentUser) // 사용자 정보 상태 설정
      } catch (err) {
        console.error('사용자 정보를 불러오는 데 실패했습니다.', err)
      } finally {
        setIsLoading(false) // 로딩 완료
      }
    }

    loadUserData() // 마운트 시 사용자 정보 가져오기
  }, [])

  return (
    <NavigationMenu className="fixed flex-row justify-between min-w-full p-4 bg-white shadow-sm h-14">
      <NavigationMenuList className="text-2xl font-bold">
        <NavigationMenuLink className="flex flex-row items-center font-apple" href="/">
          <RiDashboardFill className="mr-2" />
          NNMM
        </NavigationMenuLink>
      </NavigationMenuList>
      <NavigationMenuList className="flex items-center space-x-4">
        {isLoading ? (
          <div>로딩 중...</div>
        ) : user ? (
          // 로그인된 사용자가 있으면 이름과 회사명 표시
          <div className="flex items-center space-x-2 font-apple">
            <span>{user.companyName}</span> {/* 회사명 */}
            <span>{user.name} 님</span> {/* 이름 */}
          </div>
        ) : (
          <div>로그인 정보 없음</div>
        )}
        <LogoutButton />
        <Link href="/mypage"></Link>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
