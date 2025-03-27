import {useEffect, useState} from 'react'
import {fetchCurrentUser} from '@/services/auth'
import {getToken} from '@/utils/auth'
import Governance from '@/components/dashboard/G'

export default function G() {
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
      <Governance />
    </div>
  )
}
