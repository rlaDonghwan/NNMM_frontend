import axios from 'axios'

export const submitEsgEntry = async (payload: any) => {
  const res = await axios.post('/api/esg-report/submit', payload)
  return res.data
}
