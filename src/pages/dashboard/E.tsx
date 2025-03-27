import {useEffect, useState} from 'react'
import DashboardWelcome from '@/components/dashboard/DashboardWelcome'
import DashboardGrid from '@/components/dashboard/DashboardGrid'
import {fetchCurrentUser} from '@/services/auth'
import {getToken} from '@/utils/auth'

export default function E() {
  const [username, setUsername] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = getToken()
        if (!token) {
          console.warn('토큰이 없습니다. 로그인 필요')
          return
        }
        const user = await fetchCurrentUser(token)
        setUsername(user.email || '사용자')
      } catch (err) {
        console.error('인증 실패:', err)
      }
    }

    loadUser()
  }, [])

  return (
    <div className="min-h-screen bg-white p-10">
      <DashboardWelcome username={username} />
      <DashboardGrid />
    </div>
  )
}
