import axios from 'axios'

export const createIndicatorIfNotExists = async (label: string) => {
  const res = await axios.post('/api/indicator/check-or-create', {
    label
  })
  return res.data
}

export const fetchIndicators = async () => {
  const res = await axios.get('/api/indicator')
  return res.data
}
