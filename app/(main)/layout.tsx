import '../global.css'
import MainHeader from '@/components/layout/MainHeader'

export const metadata = {
  title: 'NNMM ESG Dashboard',
  description: 'Main public landing page'
}

// 메인 레이아웃
// 메인 레이아웃은 모든 페이지에 공통적으로 적용되는 레이아웃입니다.
export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col w-full h-full">
      <MainHeader />
      <div className="flex flex-1">{children}</div>
    </div>
  )
}
