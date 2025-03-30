import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const createIndicatorIfNotExists = async (label: string) => {
  const res = await axios.post(`${BASE_URL}/indicator/check-or-create`, {
    label
  })
  return res.data
}
