// src/utils/user.ts
import {getCookie} from 'cookies-next'
import {fetchCurrentUser} from '@/services/auth'
// import {fetchUserChartData} from '@/services/chart'

export const loadUserAndChartData = async () => {
  const token = getCookie('token')

  if (!token || typeof token !== 'string') {
    throw new Error('토큰이 없습니다.')
  }

  const user = await fetchCurrentUser(token)
  // const chartData = await fetchUserChartData(user._id)

  return {user}
}
