'use client'

import {useState, useEffect} from 'react'
import {login} from '@/services/auth'
import {setCookie} from 'cookies-next'
import {useRouter, useSearchParams} from 'next/navigation'
import {toast} from 'react-hot-toast'
import Link from 'next/link'
import {Card, CardTitle} from '@/components/ui/card'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  useEffect(() => {
    if (message === 'login-required') {
      toast.error('로그인이 필요합니다.')
    }
  }, [searchParams])

  // 입력값 검증
  const validate = () => {
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 모두 입력해주세요.')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('유효한 이메일 주소를 입력해주세요.')
      return false
    }
    return true
  }

  // 로그인 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      const res = await login({email, password})
      const token = res.data.token

      if (token) {
        setCookie('accessToken', token, {
          path: '/',
          secure: false, // ✅ VM이 HTTPS 아니면 false로!
          sameSite: 'lax' // ✅ strict 대신 lax
        })

        toast.success('로그인 성공!')
        router.push('/dashboard')
      } else {
        throw new Error('토큰이 없습니다')
      }
    } catch (err: any) {
      const status = err?.response?.status

      if (status === 401) {
        toast.error('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else if (status === 404) {
        toast.error('등록되지 않은 이메일입니다.')
      } else {
        toast.error('서버 오류가 발생했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full">
      {/* 왼쪽 소개 영역 */}
      <div
        className="absolute w-full h-full"
        style={{
          height: '100%',
          background: 'url(/images/sign.svg) no-repeat',
          zIndex: '-10'
        }}
      />
      {/* 텍스트 영역---------------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row w-full h-screen justify-center md:justify-between items-center">
        <div
          className="flex md:min-w-[330px] md:text-7xl text-6xl md:text-start text-center font-bold font-apple md:ml-56 ml-0"
          style={{
            background: 'linear-gradient(to bottom, #466AB7, #000000 95%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
          나만의 ESG
          <br />
          대시보드를
          <br />
          무한히
          <br />
          생성하세요.
        </div>
        {/* 로그인 폼 영역---------------------------------------------------------------------- */}
        <div className="flex md:mr-72 mr-0">
          <Card className="flex flex-col w-[448px] md:mt-0 mt-8 bg-white rounded-2xl shadow-lg p-8 sm:p-10">
            <CardTitle className="mb-6 text-3xl font-apple text-center text-gray-800">
              NNMM에 로그인하세요
            </CardTitle>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="email"
                name="email"
                placeholder="이메일"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border-b font-apple border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-b font-apple border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 font-apple text-white bg-black rounded-md hover:bg-blue-400 transition">
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-600 font-apple text-center">
              계정이 없으신가요?{' '}
              <Link
                href="/signup"
                className="text-blue-500 underline hover:text-blue-700">
                지금 만드세요.
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
