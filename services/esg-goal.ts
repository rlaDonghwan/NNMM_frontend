import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const fetchIndicatorsFromDashboard = async (category: string) => {
  const res = await axios.get(`${BASE_URL}/esg-dashboard/indicators/${category}`, {
    withCredentials: true
  })
  return res.data
}

export const saveGoalsToServer = async (payload: {
  category: string
  goals: {indicatorKey: string; targetValue: number; unit: string}[]
}) => {
  return await axios.post(`${BASE_URL}/esg-goal`, payload, {
    withCredentials: true
  })
}

// services/esg-goal.ts
export const fetchGoalsByCategory = async (category: string) => {
  const res = await axios.get(`${BASE_URL}/esg-goal/${category}`, {
    withCredentials: true
  })
  return res.data // [{ indicatorKey, targetValue, unit }]
}

export const deleteGoal = async (indicatorKey: string, category: string) => {
  const res = await axios.delete(`${BASE_URL}/esg-goal/${indicatorKey}/${category}`, {
    withCredentials: true
  })
  return res.data
}

export const fetchIndicatorsWithPrevYearData = async (category: string, year: number) => {
  const res = await axios.get(
    `${BASE_URL}/esg-dashboard/indicators/${category}/previous-year?year=${year}`,
    {
      withCredentials: true
    }
  )
  return res.data
}
