// React의 useState 훅을 가져옵니다.
import {useState} from 'react'
// Next.js의 Link 컴포넌트를 가져옵니다.
import Link from 'next/link'
// AuthFormWrapper 컴포넌트를 가져옵니다.
import AuthFormWrapper from '@/components/auth/AuthFormWrapper'
// 회원가입 API 호출을 위한 register 함수를 가져옵니다.
import {register} from '@/services/auth'

// SignUpForm 컴포넌트를 기본 내보내기로 정의합니다.
export default function SignUpForm() {
  // 이메일 상태를 관리합니다.
  const [email, setEmail] = useState('')
  // 이름 상태를 관리합니다.
  const [name, setName] = useState('')
  // 직책 상태를 관리합니다.
  const [position, setPosition] = useState('')
  // 비밀번호 상태를 관리합니다.
  const [password, setPassword] = useState('')
  // 비밀번호 확인 상태를 관리합니다.
  const [confirmPassword, setConfirmPassword] = useState('')
  // 에러 메시지 상태를 관리합니다.
  const [error, setError] = useState('')
  // 성공 메시지 상태를 관리합니다.
  const [success, setSuccess] = useState('')

  // 입력 필드의 값을 변경하는 핸들러 함수입니다.
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 필드에 따라 상태를 업데이트합니다.
    if (field === 'email') setEmail(value)
    if (field === 'name') setName(value)
    if (field === 'position') setPosition(value)
    if (field === 'password') setPassword(value)
    if (field === 'confirmPassword') setConfirmPassword(value)
  }

  // 계정을 생성하는 함수입니다.
  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault() // 기본 폼 제출 동작을 막습니다.

    // 비밀번호와 비밀번호 확인이 일치하지 않을 경우 에러 메시지를 설정합니다.
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      // 회원가입 API를 호출합니다.
      const res = await register({email, name, position, password})
      console.log('회원가입 성공:', res.data)
      // 성공 메시지를 설정합니다.
      setSuccess('Account created successfully')
      setError('') // 에러 메시지를 초기화합니다.
    } catch (err: any) {
      console.error('회원가입 실패:', err)
      // 에러 메시지를 설정합니다.
      setError('Failed to create account')
      setSuccess('') // 성공 메시지를 초기화합니다.
    }
  }

  return (
    // AuthFormWrapper 컴포넌트를 사용하여 회원가입 폼을 감쌉니다.
    <AuthFormWrapper title="Sign Up">
      {/* 에러 메시지가 있을 경우 화면에 표시합니다. */}
      {error && (
        <p className="text-sm text-red-500 text-center bg-red-100 p-2 rounded">{error}</p>
      )}
      {/* 성공 메시지가 있을 경우 화면에 표시합니다. */}
      {success && (
        <p className="text-sm text-green-600 text-center bg-green-100 p-2 rounded">
          {success}
        </p>
      )}

      {/* 회원가입 폼입니다. */}
      <form onSubmit={createAccount} className="space-y-4">
        {/* 이메일 입력 필드 */}
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          value={email}
          onChange={handleChange('email')}
        />
        {/* 이름 입력 필드 */}
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Name"
          value={name}
          onChange={handleChange('name')}
        />
        {/* 직책 입력 필드 */}
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Position"
          value={position}
          onChange={handleChange('position')}
        />
        {/* 비밀번호 입력 필드 */}
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          value={password}
          onChange={handleChange('password')}
        />
        {/* 비밀번호 확인 입력 필드 */}
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={handleChange('confirmPassword')}
        />
        {/* 계정 생성 버튼 */}
        <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition">
          Create Account
        </button>
      </form>

      {/* 로그인 페이지로 이동하는 링크 */}
      <div className="mt-6 text-sm text-gray-600 text-center">
        Already have an account?{' '}
        <Link href="/auth/signin" className="text-blue-500 underline hover:text-blue-700">
          Log in
        </Link>
      </div>
    </AuthFormWrapper>
  )
}
