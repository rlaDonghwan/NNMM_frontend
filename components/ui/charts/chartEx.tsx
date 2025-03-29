import {useEffect, useState} from 'react'
import {BarChart, Bar, XAxis, CartesianGrid} from 'recharts'
import axios from 'axios'

const ChartPage = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      // 실제 API 호출로 데이터를 가져오세요
      const response = await axios.get('/api/chart-data')
      setData(response.data)
    }
    fetchData()
  }, [])

  return (
    <div>
      <h1 className="text-sm">Bar Chart Example</h1>
      <BarChart width={300} height={200} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" className="text-sm" />
        <Bar dataKey="desktop" fill="#8884d8" />
      </BarChart>
    </div>
  )
}

export default ChartPage
