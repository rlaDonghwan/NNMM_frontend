// layout.tsx
'use client'
import MainHeader from '@/components/layout/MainHeader'
import {Toaster} from 'react-hot-toast'

//로그인 회원가입 레이아웃
export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col w-full h-full">
      <Toaster position="top-center" />
      {/* 밑에꺼 지우면 네브바 사라짐 */}
      <MainHeader />
      <div className="flex flex-1">{children}</div>
    </div>
  )
}
