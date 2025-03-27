import {useEffect, useState} from 'react'
import Environment from '@/components/dashboard/environmental'
import {loadUserAndChartData} from '@/utils/user'

export default function environmental() {
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
      <Environment />
    </div>
  )
}
