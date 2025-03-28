import axios from 'axios' // axios 라이브러리 임포트

export const fetchIndicators = async () => {
  const res = await axios.get('/api/indicators')
  return res.data
}

export const createIndicators = async (
  newIndicators: {key: string; label: string; unit: string}[]
) => {
  const res = await axios.post('/api/indicators', newIndicators)
  return res.data
}

export const submitESGReport = async (report: any) => {
  const res = await axios.post('/api/esg-report', report)
  return res.data
}
