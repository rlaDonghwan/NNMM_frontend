import '@/app/global.css' // 글로벌 스타일 시트 임포트
import DashboardHeader from '@/components/layout/DashboardHeader' // 대시보드 헤더 컴포넌트 임포트
import DashboardSidebar from '@/components/layout/DashboardSidebar' // 대시보드 사이드바 컴포넌트 임포트
import {SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar' // 사이드바 관련 컴포넌트 임포트

export const metadata = {
  title: 'NNMM Dashboard', // 페이지 제목
  description: 'ESG 입력 및 마이페이지' // 페이지 설명
}

// 대시보드 레이아웃 컴포넌트
// 대시보드 페이지에서만 사용됩니다.
export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col w-full h-full">
      {/* ✅ 최상단 네비게이션 바 */}
      <DashboardHeader />
      <div className="relative flex flex-1">
        {/* ✅ 좌측 사이드바 */}
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarTrigger className="relative mt-20 ml-2" />{' '}
          {/* 사이드바 열기/닫기 트리거 */}
        </SidebarProvider>
        {/* ✅ 메인 콘텐츠 영역 */}
        <main className="relative flex flex-1 w-full h-full mt-14">{children}</main>
      </div>
    </div>
  )
}
