import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface GoalPayload {
  category: string
  goals: {
    indicatorKey: string
    targetValue: number
    unit: string
    year: number
  }[]
}

// ✅ 목표 저장
export const saveGoalsToServer = async (payload: GoalPayload) => {
  const res = await axios.post(`${BASE_URL}/esg-goal`, payload, {
    withCredentials: true
  })
  return res.data
}

// ✅ 전년도 데이터가 있는 지표만 불러오기
export const fetchIndicatorsWithPrevYearData = async (category: string, year: number) => {
  const res = await axios.get(
    `${BASE_URL}/esg-dashboard/indicators/${category}/previous-year?year=${year}`,
    {
      withCredentials: true
    }
  )
  return res.data // [{ key, label, unit }]
}

// ✅ 연도별 목표 조회
export const fetchGoalsByCategory = async (category: string, year: number) => {
  const res = await axios.get(`${BASE_URL}/esg-goal/${category}?year=${year}`, {
    withCredentials: true
  })
  return res.data // [{ indicatorKey, targetValue, unit, year }]
}

// ✅ 목표 삭제 (지표 + 카테고리 + 연도)
export const deleteGoal = async (
  indicatorKey: string,
  category: string,
  year: number
) => {
  const res = await axios.delete(
    `${BASE_URL}/esg-goal/${indicatorKey}/${category}?year=${year}`,
    {
      withCredentials: true
    }
  )
  return res.data
}
