import Link from 'next/link' // Next.js의 Link 컴포넌트를 가져옴 (페이지 간 이동에 사용)
import {Button} from '@/components/ui/button' // 커스텀 버튼 컴포넌트를 가져옴
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar' // 아바타 관련 컴포넌트를 가져옴
import React, {useEffect, useState} from 'react' // React의 useEffect와 useState 훅을 가져옴
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from '@/components/ui/navigation-menu' // 네비게이션 메뉴 관련 컴포넌트를 가져옴
import {SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar' // 사이드바 관련 컴포넌트를 가져옴
import {AppSidebar} from '@/app/dashboard/layout' // 대시보드의 사이드바 컴포넌트를 가져옴
import {getCookie, deleteCookie} from 'cookies-next' // 쿠키를 가져오거나 삭제하는 유틸리티를 가져옴
import {useRouter} from 'next/router' // Next.js의 useRouter 훅을 가져옴 (라우팅에 사용)
import {fetchCurrentUser} from 'services/auth' // 현재 사용자 정보를 가져오는 서비스 함수 가져옴..

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head />
      <body className="bg-gray-100">
        <main>{children}</main>
      </body>
    </html>
  )
}

// export default function Layout({children}: {children: React.ReactNode}) {
//   // Layout 컴포넌트 정의
//   const [username, setUsername] = useState('') // 사용자 이름 상태를 관리하는 useState 훅
//   const router = useRouter() // 라우터 객체를 가져옴

//   useEffect(() => {
//     // 컴포넌트가 렌더링될 때 실행되는 효과 훅
//     const loadUser = async () => {
//       // 비동기로 사용자 정보를 로드하는 함수
//       const token = await Promise.resolve(getCookie('token')) // 쿠키에서 토큰 값을 가져옴
//       if (!token || typeof token !== 'string') return // 토큰이 없거나 문자열이 아니면 종료

//       try {
//         const user = await fetchCurrentUser(token) // 토큰으로 사용자 정보를 가져옴
//         setUsername(user.name || user.email) // 사용자 이름 또는 이메일을 상태에 저장
//       } catch (err) {
//         console.error('사용자 정보 불러오기 실패:', err) // 오류 발생 시 콘솔에 출력
//       }
//     }

//     loadUser() // 사용자 정보 로드 함수 호출
//   }, []) // 의존성 배열이 비어 있으므로 컴포넌트가 처음 렌더링될 때만 실행

//   const handleLogout = () => {
//     // 로그아웃 버튼 클릭 시 실행되는 함수
//     deleteCookie('token') // 토큰 쿠키 삭제
//     deleteCookie('username') // 사용자 이름 쿠키 삭제
//     router.push('/auth/signin') // 로그인 페이지로 이동
//   }

//   return (
//     <>
//       <NavigationMenu className="flex justify-between min-w-full p-4 bg-white shadow">
//         {' '}
//         {/* 네비게이션 메뉴 */}
//         <NavigationMenuList className="text-2xl font-bold">
//           {' '}
//           {/* 로고 및 제목 */}
//           <img
//             src="/images/Dashboard.png" // 대시보드 로고 이미지
//             alt="NNMM" // 대체 텍스트
//             className="inline-block w-8 h-8 mr-2" // 이미지 스타일
//           />
//           NNMM {/* 제목 텍스트 */}
//         </NavigationMenuList>
//         <NavigationMenuList className="flex items-center space-x-4">
//           {' '}
//           {/* 사용자 정보 및 로그아웃 버튼 */}
//           {username ? ( // 사용자 이름이 있으면
//             <span className="text-xl text-gray-700 font-apple">{username} 님</span> // 사용자 이름 표시
//           ) : (
//             <span className="text-xl text-gray-400 font-apple">게스트</span> // 게스트 표시
//           )}
//           <Button className="mr-4" onClick={handleLogout}>
//             {' '}
//             {/* 로그아웃 버튼 */}
//             로그아웃
//           </Button>
//           <Avatar>
//             {' '}
//             {/* 사용자 아바타 */}
//             <AvatarImage
//               src="https://avatars.githubusercontent.com/u/118759932?v=4&size=64" // 아바타 이미지 URL
//               alt="사용자 아바타" // 대체 텍스트
//             />
//             <AvatarFallback>CNs</AvatarFallback> {/* 이미지 로드 실패 시 표시될 텍스트 */}
//           </Avatar>
//         </NavigationMenuList>
//       </NavigationMenu>
//       <SidebarProvider>
//         {' '}
//         {/* 사이드바 컨텍스트 제공 */}
//         <AppSidebar /> {/* 대시보드 사이드바 */}
//         <main className="p-4">{children}</main> {/* 메인 콘텐츠 영역 */}
//       </SidebarProvider>
//     </>
//   )
// }
