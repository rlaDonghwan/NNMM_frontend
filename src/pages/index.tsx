// React의 useEffect 훅을 가져옵니다.
import {useEffect} from 'react'
// Next.js의 useRouter 훅을 가져옵니다.
import {useRouter} from 'next/router'

// 이 컴포넌트는 Next.js의 메인 페이지(index 페이지)로, 사용자를 '/auth/login' 경로로 리다이렉트합니다.
export default function Home() {
  // Next.js의 라우터 객체를 가져옵니다.
  const router = useRouter()

  // 컴포넌트가 렌더링된 후 실행되는 useEffect 훅입니다.
  useEffect(() => {
    // 사용자를 '/auth/login' 경로로 리다이렉트합니다.
    router.replace('/auth/signin')
  }, []) // 빈 배열을 전달하여 이 효과는 컴포넌트가 처음 렌더링될 때 한 번만 실행됩니다.

  // 이 컴포넌트는 화면에 아무것도 렌더링하지 않습니다.
  return null
}
