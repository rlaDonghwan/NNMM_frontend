// import {useEffect, useState} from 'react'
import {loadUserAndChartData} from 'utils/user'
import Social from '@/components/dashboard/social'

export default function social() {
  // const [username, setUsername] = useState('')

  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       const {user} = await loadUserAndChartData()
  //       setUsername(user.email || '사용자')
  //     } catch (err) {
  //       console.error('인증 실패:', err)
  //     }
  //   }

  //   loadUser()
  // }, [])

  return (
    <div className="min-h-screen bg-white p-10">
      <Social />
    </div>
  )
}
