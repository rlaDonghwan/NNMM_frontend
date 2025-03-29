// app/(bar)/layout.tsx
import '@/app/global.css'
import DashboardHeader from '@/components/layout/DashboardHeader'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import {SidebarProvider} from '@/components/ui/sidebar'

export const metadata = {
  title: 'NNMM Dashboard',
  description: 'ESG 입력 및 마이페이지'
}
//대시보드 레이아웃
// 대시보드 레이아웃은 대시보드 페이지에만 사용됩니다.
export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body className="w-full h-full">
        {/* <SidebarProvider> */}
        <div className="flex">
          {/* ✅ 좌측 사이드바 */}
          {/* <DashboardSidebar /> */}

          {/* ✅ 우측 콘텐츠 영역 */}
          <div className="flex flex-col flex-1">
            <DashboardHeader />
            <main>{children}</main>
          </div>
        </div>
        {/* </SidebarProvider> */}
      </body>
    </html>
  )
}
