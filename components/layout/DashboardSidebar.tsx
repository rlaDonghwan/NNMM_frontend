// 'use client'
import {Sidebar, SidebarContent, SidebarTrigger} from '@/components/ui/sidebar'
import Link from 'next/link'
import {RiDashboardFill} from 'react-icons/ri'
// import {useRouter} from 'next/router' // Next.js의 useRouter 훅 임포트 (라우터 정보 접근용)

/**
 * DashboardSidebar 컴포넌트는 대시보드 페이지의 사이드바를 렌더링합니다.
 *
 * @component
 * @returns {JSX.Element} 대시보드 사이드바 UI를 반환합니다.
 *
 * @description
 * - 이 컴포넌트는 대시보드와 관련된 네비게이션 링크를 제공합니다.
 * - 각 네비게이션 아이템은 아이콘과 텍스트로 구성되어 있으며, 클릭 시 해당 경로로 이동합니다.
 * - 사이드바는 대시보드, 환경(Environment), 사회(Social), 거버넌스(Governance) 섹션으로 구성됩니다.
 *
 * @example
 * ```tsx
 * <DashboardSidebar />
 * ```
 *
 * @remarks
 * - `Sidebar`와 `SidebarContent`는 스타일링을 위해 사용됩니다.
 * - `NavItem` 컴포넌트는 각 네비게이션 링크를 정의합니다.
 * - 아이콘은 `RiDashboardFill` 및 이미지 파일을 사용하여 렌더링됩니다.
 */
export default function DashboardSidebar() {
  // AppSidebar 컴포넌트 정의
  // const router = useRouter() // 현재 라우터 정보를 가져옴
  // const isD = router.pathname === '/dashboard' // 현재 경로가 '/dashboard'인지 확인
  // const isE = router.pathname === '/dashboard/environmental' // 현재 경로가 '/dashboard/environmental'인지 확인
  // const isS = router.pathname === '/dashboard/social' // 현재 경로가 '/dashboard/social'인지 확인
  // const isG = router.pathname === '/dashboard/governance' // 현재 경로가 '/dashboard/governance'인지 확인
  return (
    <Sidebar className="flex w-48 h-full bg-gradient-to-b from-[#88CCE6] to-[#E5E5E5] z-[-10]">
      <SidebarContent className="flex flex-col space-y-2 p-4">
        <NavItem
          href="/dashboard"
          icon={<RiDashboardFill className="w-6 h-6" />}
          text="Dashboard"
        />
        <NavItem
          href="/dashboard/environmental"
          icon={<img src="/images/E.png" alt="E" className="w-6 h-6" />}
          text="Environment"
        />
        <NavItem
          href="/dashboard/social"
          icon={<img src="/images/S.png" alt="S" className="w-6 h-6" />}
          text="Social"
        />
        <NavItem
          href="/dashboard/governance"
          icon={<img src="/images/G.png" alt="G" className="w-6 h-6" />}
          text="Governance"
        />
      </SidebarContent>
    </Sidebar>
  )
}

// ✅ 네비게이션 아이템을 재사용할 수 있도록 컴포넌트로 분리
function NavItem({
  href,
  icon,
  text
}: {
  href: string
  icon: React.ReactNode
  text: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-x-3 px-4 py-2 rounded-md hover:bg-gray-500/30">
      {icon}
      <span>{text}</span>
    </Link>
  )
}
