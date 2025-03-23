// src/components/auth/SignInForm.tsx
import {useState} from 'react'
import Link from 'next/link'
import AuthFormWrapper from '@/components/auth/AuthFormWrapper'
import {login} from '@/services/auth'

export default function SignInForm() {
  // 이메일 상태를 관리하는 useState 훅
  const [email, setEmail] = useState('')
  // 비밀번호 상태를 관리하는 useState 훅
  const [password, setPassword] = useState('')
  // 에러 메시지 상태를 관리하는 useState 훅
  const [error, setError] = useState('')

  // 폼 제출 시 호출되는 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // 기본 폼 제출 동작 방지

    try {
      // 로그인 API 호출
      const res = await login({email, password})
      // 로그인 성공 시 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', res.data.token)
      console.log('로그인 성공:', res.data, localStorage.getItem('token'))
      // 대시보드 페이지로 리다이렉트
      window.location.href = '/dashboard'
    } catch (err: any) {
      // 로그인 실패 시 에러 처리
      console.error('로그인 실패:', err)
      setError('이메일 또는 비밀번호가 올바르지 않습니다') // 에러 메시지 설정
    }
  }

  return (
    <AuthFormWrapper title="Login">
      {error && (
        <p className="mb-4 text-center text-sm text-red-500 bg-red-100 p-2 rounded">
          {error}
        </p>
      )}

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
