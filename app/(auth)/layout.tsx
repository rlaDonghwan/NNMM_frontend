// layout.tsx
'use client'
import MainHeader from '@/components/layout/MainHeader'
import {Toaster} from 'react-hot-toast'

//로그인 회원가입 레이아웃
export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body>
        <Toaster position="top-center" />
        {/* 밑에꺼 지우면 네브바 사라짐 */}
        <MainHeader />
        {children}
      </body>
    </html>
  )
}
