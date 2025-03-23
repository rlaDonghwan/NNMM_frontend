import {NextRequest, NextResponse} from 'next/server'
import {NEVER} from 'zod'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  mathcer: ['/dashboard/:path*'] // /dashboard 경로로 시작하는 모든 요청에 미들웨어 적용
}
