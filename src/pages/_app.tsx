// 애플리케이션의 전역 CSS 스타일을 가져옵니다.
import '@/styles/globals.css'

// Next.js에서 제공하는 AppProps 타입을 가져옵니다. (타입 안전성을 위해 사용)
import type {AppProps} from 'next/app'

// 메인 애플리케이션 컴포넌트를 정의합니다.
// 이 컴포넌트는 모든 페이지를 감싸며, 공통 레이아웃이나 로직을 추가할 수 있습니다.
function MyApp({Component, pageProps}: AppProps) {
  // 현재 페이지 컴포넌트를 해당 props와 함께 렌더링합니다.
  return <Component {...pageProps} />
}

// MyApp 컴포넌트를 이 파일의 기본 내보내기로 설정합니다.
export default MyApp

// 이 파일은 Next.js 애플리케이션에서 커스텀 App 컴포넌트 역할을 합니다.
// 페이지를 초기화하며, 전역 스타일, 레이아웃, 또는 모든 페이지에서 공유되어야 하는 로직을 추가하는 데 사용됩니다.
