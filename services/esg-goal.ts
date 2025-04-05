import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const fetchIndicatorsFromDashboard = async (category: string) => {
  const res = await axios.get(`${BASE_URL}/esg-dashboard/indicators/${category}`, {
    withCredentials: true
  })
  return res.data // [{ indicatorKey, label, unit }]
}
