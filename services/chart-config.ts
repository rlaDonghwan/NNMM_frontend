import axios from 'axios'

// 환경 변수에서 API 기본 URL 가져오기
const BASE_URL = process.env.NEXT_PUBLIC_API_URL

//----------------------------------------------------------------------------------------------------
// 차트 설정 저장 함수
export async function saveChartConfig({
  chartType,
  selectedRows,
  rows,
  indicators,
  colorSet,
  years,
  title,
  category
}: {
  chartType: string
  selectedRows: number[]
  rows: any[]
  indicators: any[]
  colorSet: string[]
  years: number[]
  title: string
  category: 'social' | 'environmental' | 'governance'
}) {
  const rowsWithUnit = rows.map(row => ({
    ...row,
    unit: indicators.find(ind => ind.key === row.indicatorKey)?.unit || row.unit || ''
  }))
  const existingCharts = await fetchUserCharts(category)
  const newOrder = existingCharts.length + 1
  const payload = {
    category,
    charts: [
      {
        chartType,
        title,
        order: newOrder,
        unit:
          indicators.find(ind => ind.key === rows[selectedRows[0]]?.indicatorKey)?.unit ||
          '',
        years,
        fields: selectedRows.map((rowIndex, i) => {
          const row = rowsWithUnit[rowIndex]
          return {
            key: row.indicatorKey,
            label:
              indicators.find(ind => ind.key === row.indicatorKey)?.label ||
              row.indicatorKey,
            field1: row.field1,
            field2: row.field2,
            unit: row.unit,
            color: colorSet[i],
            data: Object.fromEntries(years.map(y => [y, Number(row.values[y] || 0)]))
          }
        })
      }
    ]
  }

  // ✅ 절대 경로로 수정
  return axios.post(`${BASE_URL}/esg-dashboard`, payload, {
    withCredentials: true
  })
}

//----------------------------------------------------------------------------------------------------

// 사용자 차트 호출 함수
export const fetchUserCharts = async (category?: string) => {
  const params = category ? {category} : {}

  const res = await axios.get(`${BASE_URL}/esg-dashboard`, {
    withCredentials: true,
    params
  })

  console.log('[📊 chart item structure]', res.data)
  return res.data
}

//----------------------------------------------------------------------------------------------------

// 차트 순서 불러오기 + 기존 코드 밑에 코드 이상하면 이걸로 바꾸기
// export const updateChartOrder = async (orderedIds: string[]) => {
//   return axios.post(`${BASE_URL}/chart/order`, {orderedIds}, {withCredentials: true})
// }
//이차 차트 순서 불러오기 바꾼건데 코드 이해 안감 -> 다시 좀 보자잉
export async function updateChartOrder(orderedCharts) {
  return await fetch(`${BASE_URL}/esg-dashboard/order`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({charts: orderedCharts}),
    credentials: 'include'
  })
}
