import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import DashboardGrid from '@/components/dashboard/DashboardGrid'
import {fetchCurrentUser} from 'services/auth'
import {toast} from 'react-hot-toast'
import {GetServerSideProps} from 'next'

interface DashboardProps {
  token?: string
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const token = req.cookies?.token || null

  return {
    props: {
      token
    }
  }
}

export default function Dashboard({token}: DashboardProps) {
  const [username, setUsername] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return

    const loadUser = async () => {
      if (!token) {
        toast.error('로그인이 필요합니다.')
        router.replace('/auth/signin')

        return
      }

      try {
        const user = await fetchCurrentUser(token)
        setUsername(user.email || '사용자')
      } catch (err) {
        toast.error('인증 실패. 다시 로그인해주세요.')
        router.replace('/auth/signin')
        console.error('인증 실패:', err)
      }
    }

    loadUser()
  }, [router.isReady, token])

  return (
    <div className="min-h-screen bg-white p-10">
      <DashboardGrid />
    </div>
  )
}
