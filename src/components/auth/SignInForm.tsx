// src/components/auth/SignInForm.tsx
import {useState} from 'react'
import Link from 'next/link'
import AuthFormWrapper from '@/components/auth/AuthFormWrapper'
import {login} from '@/services/auth'
import {toast} from 'react-hot-toast'
import router from 'next/router'

export default function SignInForm() {
  // 이 코드들은 유지가 되어야 백엔드와 통신이 가능합니다.-----------------------------------------------------------------------
  const [email, setEmail] = useState('') // 이메일 상태를 관리하는 useState 훅

  const [password, setPassword] = useState('') // 비밀번호 상태를 관리하는 useState 훅

  const [loading, setLoading] = useState(false) // 에러 메시지 상태를 관리하는 useState 훅

  // 입력값 검증 함수
  const validateInputs = () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('유효한 이메일 주소를 입력해주세요.')
      return false
    }
    return true
  }
  // ------------------------------------------------------------------------------------

  // 폼 제출 시 호출되는 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // 기본 폼 제출 동작 방지
    if (!validateInputs()) return

    setLoading(true)

    try {
      // 로그인 API 호출
      const res = await login({email, password})
      const token = res.data.token

      if (token) {
        localStorage.setItem('token', token)
        toast.success('로그인 성공')
        router.push('/dashboard')
      } else {
        throw new Error('토큰이 없습니다')
      }
    } catch (err: any) {
      const status = err?.response?.status // 에러 상태 코드
      const msg = err?.response?.data?.message || err.message // 에러 메시지

      if (status === 401) {
        toast.error('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else if (status === 404) {
        toast.error('등록되지 않는 이메일입니다.')
      } else if (status >= 500) {
        toast.error('서버 에러가 발생했습니다. 잠시후 다시 시도해주세요.')
      }
    } finally {
      setLoading(false)
    }
    // ------------------------------------------------------------------------------------
  }

  return (
    <AuthFormWrapper title="Login">
      {/* 폼 요소들을 포함한 폼 컴포넌트 */}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition">
          Login
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-600 text-center">
        Create account?{' '}
        <Link href="/auth/signup" className="text-blue-500 underline hover:text-blue-700">
          Sign Up
        </Link>
      </div>
    </AuthFormWrapper>
  )
}
