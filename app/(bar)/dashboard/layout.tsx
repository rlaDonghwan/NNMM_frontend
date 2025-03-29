import {
  SidebarInset,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader
} from '@/components/ui/sidebar' // Sidebar 관련 UI 컴포넌트 임포트
import Link from 'next/link' // Next.js의 Link 컴포넌트 임포트 (페이지 이동용)
import {Button} from '@/components/ui/button' // 버튼 UI 컴포넌트 임포트
// import {useRouter} from 'next/router' // Next.js의 useRouter 훅 임포트 (라우터 정보 접근용)

export function AppSidebar() {
  // AppSidebar 컴포넌트 정의
  // const router = useRouter() // 현재 라우터 정보를 가져옴
  // const isD = router.pathname === '/dashboard' // 현재 경로가 '/dashboard'인지 확인
  // const isE = router.pathname === '/dashboard/environmental' // 현재 경로가 '/dashboard/environmental'인지 확인
  // const isS = router.pathname === '/dashboard/social' // 현재 경로가 '/dashboard/social'인지 확인
  // const isG = router.pathname === '/dashboard/governance' // 현재 경로가 '/dashboard/governance'인지 확인
  return (
    <SidebarInset
      className="flex min-h-full" // SidebarInset 컴포넌트에 클래스와 스타일 적용
      style={{
        background: 'linear-gradient(to bottom, #88CCE6, #E5E5E5 95%)', // 배경 그라데이션 설정
        maxWidth: '200px' // 최대 너비 설정
      }}>
      <SidebarHeader /> {/* Sidebar 상단 헤더 */}
      <SidebarContent>
        {/* Sidebar 내용 */}
        <div className="flex flex-col items-center space-y-4">
          {/* 버튼들을 세로로 정렬 */}
          <Link href="/dashboard" legacyBehavior passHref>
            {/* '/dashboard'로 이동하는 링크 */}
            <button
              type="submit" // 버튼 타입 설정
              className="hover:bg-gray-500 hover:bg-opacity-30 w-full rounded-md flex items-center space-x-2">
              {/* 버튼 스타일 */}
              <img src="/images/dsvg.svg" alt="Main" className="ml-8 w-8 h-8" />
              {/* 버튼 아이콘 */}
              <span>Dashboard {/* 버튼 텍스트 */}</span>
            </button>
          </Link>
          <Link href="/dashboard/environmental" legacyBehavior passHref>
            {/* '/dashboard/environmental'로 이동하는 링크 */}
            <button
              type="submit"
              className="hover:bg-gray-500 hover:bg-opacity-30 w-full rounded-md flex items-center space-x-2">
              <img src="/images/E.png" alt="E" className="ml-8 w-8 h-8" />
              {/* 버튼 아이콘 */}
              <span>Environment {/* 버튼 텍스트 */}</span>
            </button>
          </Link>
          <Link href="/dashboard/social" legacyBehavior passHref>
            {/* '/dashboard/social'로 이동하는 링크 */}
            <button
              type="submit"
              className="hover:bg-gray-500 hover:bg-opacity-30 w-full rounded-md flex items-center space-x-2">
              <img src="/images/S.png" alt="S" className="ml-8 w-8 h-8" />
              {/* 버튼 아이콘 */}
              <span>Social {/* 버튼 텍스트 */}</span>
            </button>
          </Link>
          <Link href="/dashboard/governance" legacyBehavior passHref>
            {/* '/dashboard/governance'로 이동하는 링크 */}
            <button
              type="submit"
              className="hover:bg-gray-500 hover:bg-opacity-30 w-full rounded-md flex items-center space-x-2">
              <img src="/images/G.png" alt="G" className="ml-8 w-8 h-8" />
              {/* 버튼 아이콘 */}
              <span>Governance {/* 버튼 텍스트 */}</span>
            </button>
          </Link>
        </div>
        <SidebarGroup /> {/* 추가 Sidebar 그룹 */}
        <SidebarGroup /> {/* 추가 Sidebar 그룹 */}
      </SidebarContent>
      <SidebarFooter /> {/* Sidebar 하단 푸터 */}
    </SidebarInset>
  )
}
