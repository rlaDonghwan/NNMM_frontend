// src/components/auth/SignInForm.tsx
// import {useState} from 'react'
import Link from 'next/link'
import {setCookie} from 'cookies-next'
import {login} from 'services/auth'
import {Card, CardTitle} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {toast} from 'react-hot-toast'
import router from 'next/router'

export default function SignInForm() {
  // 이 코드들은 유지가 되어야 백엔드와 통신이 가능합니다.-----------------------------------------------------------------------
  // const [email, setEmail] = useState('') // 이메일 상태를 관리하는 useState 훅

  // const [password, setPassword] = useState('') // 비밀번호 상태를 관리하는 useState 훅

  // const [loading, setLoading] = useState(false) // 에러 메시지 상태를 관리하는 useState 훅

  // 입력값 검증 함수
  // const validateInputs = () => {
  //   if (!email || !password) {
  //     alert('이메일과 비밀번호를 입력해주세요')
  //     return false
  //   }
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  //   if (!emailRegex.test(email)) {
  //     toast.error('유효한 이메일 주소를 입력해주세요.')
  //     return false
  //   }
  //   return true
  // }
  // ------------------------------------------------------------------------------------

  // 폼 제출 시 호출되는 함수
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault() // 기본 폼 제출 동작 방지
  //   if (!validateInputs()) return

  //   setLoading(true)

  //   try {
  //     // 로그인 API 호출
  //     const res = await login({email, password})
  //     const token = res.data.token

  //     if (token) {
  //       setCookie('token', token, {
  //         maxAge: 60 * 60 * 24,
  //         path: '/',
  //         secure: process.env.NODE_ENV === 'production',
  //         sameSite: 'strict'
  //       })
  //       toast.success('로그인 성공')
  //       router.push('/dashboard')
  //     } else {
  //       throw new Error('토큰이 없습니다')
  //     }
  //   } catch (err: any) {
  //     const status = err?.response?.status // 에러 상태 코드
  //     const msg = err?.response?.data?.message || err.message // 에러 메시지

  //     if (status === 401) {
  //       toast.error('이메일 또는 비밀번호가 올바르지 않습니다.')
  //     } else if (status === 404) {
  //       toast.error('등록되지 않는 이메일입니다.')
  //     } else if (status >= 500) {
  //       toast.error('서버 에러가 발생했습니다. 잠시후 다시 시도해주세요.')
  //     }
  //   } finally {
  //     setLoading(false)
  //   }
  //   // ------------------------------------------------------------------------------------
  // }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="relative w-[50vw] z-0">
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(0% -100%, 100% 5%, 80% 100%, 0% 90%)',
            background: 'linear-gradient(to bottom, #88CCE6, #E5E5E5 95%)',
            zIndex: 0
          }}
        />
      </div>
      {/* 배경 이미지에 들어갈 타이틀 텍스트 ---------------------------------------------------------------*/}
      <div
        className="absolute top-64 left-40 text-7xl font-bold  text-center"
        style={{
          background: 'linear-gradient(to bottom, #466AB7, #000000 95%)',
          WebkitBackgroundClip: 'text', // Safari 및 WebKit 기반 브라우저에 적용
          backgroundClip: 'text', // 다른 브라우저 지원
          color: 'transparent', // 텍스트 색을 투명하게 설정
          zIndex: 10
        }}>
        나만의 ESG
        <br />
        대시보드를
        <br />
        무한히
        <br />
        생성하세요.
      </div>
      {/* shadcn에서 다운받은 card component를 활용하여 로그인 폼 생성---------------------------------------- */}
      <div className="flex items-center justify-center min-h-screen bg-[rgba(255,255,255,0.0)] ml-20">
        <Card className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
          <CardTitle className="mb-6 text-3xl font-semibold text-center text-gray-800">
            NNMM에 로그인하세요
          </CardTitle>
          <form className="space-y-4">
            <input
              type="email"
              className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="이메일"
              // value={email}
              // onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="비밀번호"
              // value={password}
              // onChange={e => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-2 font-semibold text-white bg-black rounded-md hover:bg-blue-600 transition">
              로그인
            </button>
          </form>
          <div className="mt-6 text-sm text-gray-600 text-center">
            계정이 없으신가요?{' '}
            <Link href="signup" className="text-blue-500 underline hover:text-blue-700">
              지금 만드세요.
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
