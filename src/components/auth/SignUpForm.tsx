import {useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import AuthFormWrapper from '@/components/auth/AuthFormWrapper'
import {register} from '@/services/auth'
import {toast} from 'react-hot-toast'

// SignUpForm 컴포넌트를 기본 내보내기로 정의합니다.
export default function SignUpForm() {
  // 이 코드들은 유지가 되어야 백엔드와 통신이 가능합니다.-----------------------------------------------------------------------
  const router = useRouter() // useRouter 훅을 초기화합니다.
  const [email, setEmail] = useState('') // 이메일 상태를 관리합니다.
  const [name, setName] = useState('') // 이름 상태를 관리합니다.
  const [companyName, setCompanyName] = useState('') // 직책 상태를 관리합니다.
  const [password, setPassword] = useState('') // 비밀번호 상태를 관리합니다.
  const [confirmPassword, setConfirmPassword] = useState('') // 비밀번호 확인 상태를 관리합니다.
  const [error, setError] = useState('') // 에러 메시지 상태를 관리합니다.
  const [success, setSuccess] = useState('') // 성공 메시지 상태를 관리합니다.

  // 입력 필드의 값을 변경하는 핸들러 함수입니다.
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 필드에 따라 상태를 업데이트합니다.
    if (field === 'email') setEmail(value)
    if (field === 'name') setName(value)
    if (field === 'companyName') setCompanyName(value)
    if (field === 'password') setPassword(value)
    if (field === 'confirmPassword') setConfirmPassword(value)
  }
  // ------------------------------------------------------------------------------------

  // 계정을 생성하는 함수입니다.
  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault() // 기본 폼 제출 동작을 막습니다.

    // 비밀번호와 비밀번호 확인이 일치하지 않을 경우 에러 메시지를 설정합니다.
    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.')
      return
    }

    // 이메일 형식 검사 정규식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('유효한 이메일 형식을 입력해주세요.')
      return
    }

    try {
      await register({email, name, companyName, password}) // 회원가입 API를 호출합니다.
      toast.success('회원가입 성공!') // 성공 메시지를 설정합니다.

      setTimeout(() => {
        router.push('/auth/signin') // 로그인 페이지로 이동합니다.
      }, 1000) // 2초 후에 이동합니다.
    } catch (err: any) {
      const msg = err?.response.data?.message || '회원가입에 실패했습니다.'
      toast.error(msg) // 에러 메시지를 설정합니다.
    }
  }
  // ------------------------------------------------------------------------------------

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
        {/* 회사명 입력 필드 */}
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="companyName"
          value={companyName}
          onChange={handleChange('companyName')}
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
