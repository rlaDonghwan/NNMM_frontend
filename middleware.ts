import {NextRequest, NextResponse} from 'next/server'

// [1] 로그인 여부 확인 미들웨어
function checkAuth(req: NextRequest): NextResponse | void {
  const token = req.cookies.get('accessToken')?.value
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')

  if (!token && !isAuthPage) {
    // 🔽 로그인 페이지로 리디렉트하면서 메시지 쿼리 추가
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/signin'
    loginUrl.searchParams.set('message', 'login-required')
    return NextResponse.redirect(loginUrl)
  }
}

// [2] 요청 로깅 미들웨어
function logger(req: NextRequest) {
  console.log(`[미들웨어 로그] ${req.method} ${req.nextUrl.pathname}`)
}

// [3] 최종 미들웨어 엔트리
export function middleware(req: NextRequest) {
  logger(req)

  const authRedirect = checkAuth(req)
  if (authRedirect) return authRedirect

  return NextResponse.next()
}

// [4] matcher 설정
export const config = {
  matcher: ['/dashboard/:path*', '/bar/:path*', '/mypage/:path*']
}
