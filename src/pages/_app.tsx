import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {Toaster} from 'react-hot-toast'
import Layout from '@/components/common/Layout'
import {useRouter} from 'next/router'

// 메인 애플리케이션 컴포넌트를 정의합니다.
export default function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter()

  // Layout이 필요 없는 페이지 경로를 정의합니다.
  const noLayoutPages = ['/auth/signin', '/auth/signup', 'main/main']
  const isNoLayoutPage = noLayoutPages.includes(router.pathname)

  return isNoLayoutPage ? (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Component {...pageProps} />
    </>
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
