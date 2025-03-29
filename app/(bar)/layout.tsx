// app/(bar)/layout.tsx
import '@/app/global.css'
import DashboardHeader from '@/components/layout/DashboardHeader'

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
        <DashboardHeader />
        <main>{children}</main>
      </body>
    </html>
  )
}
