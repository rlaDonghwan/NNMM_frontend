import {useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {register} from 'services/auth'
import {toast} from 'react-hot-toast'
import {Card, CardTitle} from '@/components/ui/card'

// SignUpForm 컴포넌트를 기본 내보내기로 정의합니다.
export default function SignUpForm() {
  // 이 코드들은 유지가 되어야 백엔드와 통신이 가능합니다.-----------------------------------------------------------------------
  const router = useRouter() // useRouter 훅을 초기화합니다.
  const [email, setEmail] = useState('') // 이메일 상태를 관리합니다.
  const [name, setName] = useState('') // 이름 상태를 관리합니다.
  const [companyName, setCompanyName] = useState('') // 직책 상태를 관리합니다.
  const [password, setPassword] = useState('') // 비밀번호 상태를 관리합니다.
  const [confirmPassword, setConfirmPassword] = useState('') // 비밀번호 확인 상태를 관리합니다.

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
        className="absolute top-64 left-40 text-8xl font-bold  text-center"
        style={{
          background: 'linear-gradient(to bottom, #466AB7, #000000 95%)',
          WebkitBackgroundClip: 'text', // Safari 및 WebKit 기반 브라우저에 적용
          backgroundClip: 'text', // 다른 브라우저 지원
          color: 'transparent', // 텍스트 색을 투명하게 설정
          zIndex: 10
        }}>
        회원 가입,
        <br />
        큰 변화의
        <br />
        시작입니다.
      </div>

      {/* 회원가입 폼입니다. */}
      <div className="flex items-center justify-center min-h-screen bg-[rgba(255,255,255,0.0)] translate-x-20">
        <Card className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-5">
          <CardTitle className="mb-6 text-3xl font-semibold text-center text-white-800">
            지금 만드세요.
          </CardTitle>
          <form onSubmit={createAccount} className="space-y-5">
            {/* 이메일 입력 필드 */}
            <input
              type="email"
              className="w-full px-4 py-2 border-b border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="이메일"
              value={email}
              onChange={handleChange('email')}
            />
            {/* 이름 입력 필드 */}
            <input
              type="text"
              className="w-full px-4 py-2 border-b border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="이름"
              value={name}
              onChange={handleChange('name')}
            />
            {/* 회사명 입력 필드 */}
            <input
              type="text"
              className="w-full px-4 py-2 border-b border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="회사명"
              value={companyName}
              onChange={handleChange('companyName')}
            />
            {/* 비밀번호 입력 필드 */}
            <input
              type="password"
              className="w-full px-4 py-2 border-b border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="비밀번호"
              value={password}
              onChange={handleChange('password')}
            />
            {/* 비밀번호 확인 입력 필드 */}
            <input
              type="password"
              className="w-full px-4 py-2 border-b border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={handleChange('confirmPassword')}
            />
            {/* 계정 생성 버튼 */}
            <button
              type="submit"
              className="w-full py-2 font-semibold text-white bg-black rounded-md hover:bg-blue-600 transition">
              계정 생성
            </button>
          </form>

          {/* 로그인 페이지로 이동하는 링크 */}
          <div className="mt-6 text-sm text-gray-600 text-center">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/auth/signin"
              className="text-blue-500 underline hover:text-blue-700">
              로그인
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
