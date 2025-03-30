'use client'

import {useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {register} from '@/services/auth'
import {toast} from 'react-hot-toast'
import {Card, CardTitle} from '@/components/ui/card'

export default function SignUpForm() {
  const router = useRouter()

  // 입력값 상태 관리
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // 입력값 검증 함수
  const validate = () => {
    if (!email || !name || !companyName || !password || !confirmPassword) {
      toast.error('모든 항목을 입력해주세요.')
      return false
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('유효한 이메일 형식을 입력해주세요.')
      return false
    }

    // 비밀번호 일치 여부 검사
    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.')
      return false
    }

    return true
  }

  // 회원가입 처리 함수
  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    try {
      // 회원가입 API 호출
      await register({email, name, companyName, password})
      toast.success('회원가입 성공!')

      // 로그인 페이지로 이동
      setTimeout(() => {
        router.push('/signin')
      }, 1000)
    } catch (err: any) {
      const msg = err?.response?.data?.message || '회원가입에 실패했습니다.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* 왼쪽 문구 영역 */}
      <div className="relative w-[50%] z-0">
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(0% -100%, 100% 5%, 80% 100%, 0% 90%)',
            background: 'linear-gradient(to bottom, #88CCE6, #E5E5E5 95%)',
            zIndex: -10
          }}
        />
        <div
          className="flex w-full h-full text-7xl font-apple font-bold justify-center items-center"
          style={{
            background: 'linear-gradient(to bottom, #466AB7, #000000 95%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
          회원 가입,
          <br />
          큰 변화의
          <br />
          시작입니다.
        </div>
      </div>

      {/* 오른쪽 회원가입 폼 */}
      <div className="flex w-[50%] items-center justify-center bg-[rgba(255,255,255,0.0)]">
        <Card className="flex flex-col max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
          <CardTitle className="mb-6 text-3xl font-apple text-center text-gray-800">
            지금 만드세요.
          </CardTitle>

          {/* 회원가입 폼 */}
          <form onSubmit={createAccount} className="space-y-5">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-b font-apple border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 border-b font-apple border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="회사명"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border-b font-apple border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-b font-apple border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border-b font-apple border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 font-apple text-white bg-black rounded-md hover:bg-blue-400 transition">
              {loading ? '계정 생성 중...' : '계정 생성'}
            </button>
          </form>

          {/* 로그인 페이지로 이동 링크 */}
          <div className="mt-6 text-sm font-apple text-gray-600 text-center">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/signin"
              className="text-blue-500 underline font-apple hover:text-blue-700">
              로그인
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
