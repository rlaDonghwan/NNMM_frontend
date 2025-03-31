import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const createChartConfig = async (config: {
  chartType: string
  targetDataKeys: string[]
  labels: string[]
  colorSet: string
  reportId: string // ✅ 이거 추가!
}) => {
  const res = await axios.post(`${BASE_URL}/chart`, config, {
    withCredentials: true
  })
  return res.data
}
