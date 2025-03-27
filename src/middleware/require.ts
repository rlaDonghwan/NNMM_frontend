// src/middleware/requireAuth.ts
import {NextRequest, NextResponse} from 'next/server'

// 미들웨어 함수 정의
export function middleware(req: NextRequest) {
  // 쿠키에서 'token' 값을 가져옴
  const token = req.cookies.get('token')?.value
  // 현재 요청 경로가 '/auth'로 시작하는지 확인
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')

  // 토큰이 없고 요청 경로가 인증 페이지가 아닌 경우, '/auth/signin'으로 리다이렉트
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // 조건에 맞지 않으면 요청을 그대로 진행
  return NextResponse.next()
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: ['/dashboard/:path*'] // 보호할 경로 설정
}
