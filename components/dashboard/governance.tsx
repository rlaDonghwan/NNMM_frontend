import {useEffect, useState} from 'react'
import {loadUserAndChartData} from 'utils/user'
import Governance from '@/components/dashboard/governance'

export default function governance() {
  const [username, setUsername] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const {user} = await loadUserAndChartData()
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
