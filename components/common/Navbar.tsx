import Image from 'next/image' // Next.js의 Image 컴포넌트를 가져옴 (최적화된 이미지 사용)
import {useEffect, useState} from 'react' // React의 useEffect와 useState 훅을 가져옴
import {getCookie} from 'cookies-next' // cookies-next 라이브러리에서 getCookie 함수 가져옴
import {fetchCurrentUser} from 'services/auth' // 사용자 정보를 가져오는 서비스 함수 가져옴
import {useRouter} from 'next/router' // Next.js의 useRouter 훅을 가져옴 (라우팅에 사용)...

const Navbar = () => {
  const [username, setUsername] = useState<string | null>(null) // 사용자 이름 상태 관리
  const router = useRouter() // 라우터 객체 가져오기

  const [loading, setLoading] = useState(true) // 로딩 상태 관리

  useEffect(() => {
    const loadUser = async () => {
      const token = getCookie('token') // 쿠키에서 'token' 값 가져오기
      if (!token) {
        // 토큰이 없으면
        setLoading(false) // 로딩 상태 해제
        return
      }

      try {
        const user = await fetchCurrentUser(token as string) // 토큰으로 사용자 정보 가져오기
        setUsername(user?.name || user?.email) // 사용자 이름 또는 이메일 설정
      } catch (err) {
        console.error('사용자 정보 불러오기 실패:', err) // 에러 로그 출력
      } finally {
        setLoading(false) // 로딩 상태 해제
      }
    }

    loadUser() // 사용자 정보 로드 함수 호출
  }, []) // 컴포넌트가 마운트될 때 한 번 실행

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0' // 쿠키에서 토큰 삭제
    setUsername(null) // 사용자 이름 상태 초기화
    router.replace('/auth/signin') // 로그인 페이지로 리다이렉트
  }

  return (
    <div className="w-full h-20 px-6 flex justify-between items-center bg-white shadow-md">
      {/* 왼쪽 로고 */}
      <div className="flex items-center gap-4">
        <Image
          width={70}
          height={70}
          src="/main/logo.png"
          alt="로고"
          className="object-contain"
        />
        <div className="text-3xl font-semibold text-neutral-800 font-apple">NNMM</div>
      </div>

      {/* 오른쪽 사용자 영역 */}
      <div className="flex items-center gap-4">
        {!loading && ( // 로딩이 끝난 경우에만 렌더링
          <div className="flex items-center gap-4">
            {username ? ( // 사용자가 로그인한 경우
              <>
                <span className="text-lg text-neutral-700 font-apple">{username} 님</span>{' '}
                {/* 사용자 이름 표시 */}
                <Image
                  width={40}
                  height={40}
                  src="/main/settings1.svg"
                  alt="설정 아이콘"
                  className="object-contain cursor-pointer"
                  onClick={() => router.push('/settings')} // 설정 페이지로 이동
                />
                <Image
                  width={40}
                  height={40}
                  src="/main/notification.svg"
                  alt="알림 아이콘"
                  className="object-contain cursor-pointer"
                  onClick={() => router.push('/notifications')} // 알림 페이지로 이동
                />
                <Image
                  width={50}
                  height={50}
                  src="/main/profile.png"
                  alt="프로필"
                  className="rounded-full object-cover cursor-pointer"
                  onClick={() => router.push('/profile')} // 프로필 페이지로 이동
                />
                <button
                  onClick={handleLogout} // 로그아웃 버튼 클릭 시 handleLogout 호출
                  className="px-4 py-2 bg-black rounded-md text-sm text-white hover:bg-gray-800">
                  로그아웃
                </button>
              </>
            ) : (
              // 사용자가 로그인하지 않은 경우
              <button
                onClick={() => router.push('/auth/signin')} // 로그인 페이지로 이동
                className="px-4 py-2 bg-blue-500 rounded-md text-sm text-white hover:bg-blue-600">
                로그인
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar // Navbar 컴포넌트 내보내기
