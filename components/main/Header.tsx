'use client'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {checkLogin} from '@/services/auth'

export default function HeroSection() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const result = await checkLogin()
      setIsLoggedIn(result)
    }
    fetchLoginStatus()
  }, [])

  const handleClick = () => {
    if (isLoggedIn) {
      router.push('/dashboard')
    } else {
      router.push('/signin?message=login-required')
    }
  }
  return (
    <div className="flex flex-col h-screen w-full">
      {/* 배경 스타일 */}
      <div
        className="absolute w-full h-full"
        style={{
          background: 'url(/main/banner.svg) no-repeat center center/cover',
          zIndex: '-10'
        }}></div>
      {/* 컨텐츠 래퍼 */}
      {/* 왼쪽 텍스트 */}
      <div className="relative flex flex-col md:flex-row w-full h-screen justify-center items-center md:space-x-28 space-x-0">
        <div className="flex flex-col text-left space-y-8">
          <h2 className="text-indigo-700 text-4xl md:text-7xl font-apple">
            사용자가 선택한 지표를 기반으로 <br />
            자동 생성되는 그래프와 차트
          </h2>
          <p className="text-neutral-800 text-2xl md:text-5xl font-apple">
            환경, 사회, 거버넌스 지표를 자유롭게 구성하고 <br />
            맞춤형 대시보드를 만들어보세요.
          </p>
        </div>
        {/* 오른쪽 이미지 */}
        <img className="md:w-[30%] w-72" src="/main/chart.svg" alt="heroImage" />
      </div>

      {/* 버튼 */}
      <div className="flex justify-center">
        <button
          onClick={handleClick}
          className="flex w-64 h-16 md:w-80 md:h-20 mb-8 bg-black rounded-full text-white text-2xl md:text-4xl font-apple justify-center items-center">
          대시보드 생성하기
        </button>
      </div>
    </div>
  )
}
