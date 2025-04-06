'use client'
import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/navigation'
import {checkLogin} from '@/services/auth'
import {motion} from 'framer-motion'

export default function HeroSection() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const scrollTargetRef = useRef<HTMLDivElement>(null)
  const [bottomOffset, setBottomOffset] = useState(32)

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

  const handleScroll = () => {
    scrollTargetRef.current?.scrollIntoView({behavior: 'smooth'})
  }

  // 스크롤 이벤트 핸들러
  // 스크롤 위치에 따라 버튼의 위치를 조정
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const start = 50
      const end = 1000
      const min = 200
      const max = 25

      if (scrollY <= start) {
        setBottomOffset(max)
      } else if (scrollY >= end) {
        setBottomOffset(min)
      } else {
        const ratio = (scrollY - start) / (end - start)
        const newBottom = max - ratio * (max - min)
        setBottomOffset(newBottom)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
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
          <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
            viewport={{once: true}}
            className="flex flex-col text-left space-y-8">
            <h2 className="text-indigo-700 text-4xl md:text-7xl font-apple leading-snug md:leading-[1.2]">
              사용자가 선택한 지표를 기반으로 <br />
              자동 생성되는 그래프와 차트
            </h2>
            <p className="text-neutral-800 text-2xl md:text-5xl font-apple leading-snug md:leading-[1.2]">
              환경, 사회, 거버넌스 지표를 자유롭게 구성하고 <br />
              맞춤형 대시보드를 만들어보세요.
            </p>
          </motion.div>
        </div>
        {/* 오른쪽 이미지 */}
        <motion.img
          initial={{opacity: 0, scale: 0.9}}
          whileInView={{opacity: 1, scale: 1}}
          transition={{duration: 0.8, delay: 0.2}}
          viewport={{once: true}}
          className="md:w-[30%] w-72 mt-12 md:mt-0"
          src="/main/chart.svg"
          alt="heroImage"
        />
      </div>

      {/* 버튼 */}

      <div
        className="sticky bottom-32 flex justify-center z-10"
        style={{bottom: `${bottomOffset}px`}}>
        <motion.div
          className="sticky flex justify-center z-10"
          style={{bottom: `${bottomOffset}px`}}
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, delay: 0.3}}>
          <motion.button
            onClick={handleClick}
            className="flex w-64 h-16 md:w-80 md:h-20 bg-black rounded-full text-white text-2xl md:text-4xl font-apple justify-center items-center shadow-lg">
            대시보드 생성하기
          </motion.button>
        </motion.div>
      </div>
      <div ref={scrollTargetRef} className="h-[10px]"></div>
    </div>
  )
}
