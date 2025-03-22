// src/components/auth/SignInForm.tsx
import {useState} from 'react'
import Link from 'next/link'
import AuthFormWrapper from '@/components/auth/AuthFormWrapper'
import {login} from '@/services/auth'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await login({email, password})
      console.log('로그인 성공:', res.data)
      window.location.href = '/dashboard'
    } catch (err: any) {
      console.error('로그인 실패:', err)
      setError('이메일 또는 비밀번호가 올바르지 않습니다')
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
