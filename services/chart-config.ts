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

  console.log('[saveChartConfig] Sending Payload:', JSON.stringify(payload, null, 2))

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

  console.log('[fetchUserCharts] Response:', res.data)
  return res.data
}
//----------------------------------------------------------------------------------------------------

export const updateChartOrder = async (
  updatedCharts: {chartId: string; dashboardId: string; newOrder: number}[]
) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/esg-dashboard/batch-update-orders`,
      updatedCharts,
      {
        withCredentials: true
      }
    )
    console.log('차트 순서 저장 성공!', response.data)
  } catch (error: any) {
    console.error('차트 순서 저장 실패 😢')
  }
}

//----------------------------------------------------------------------------------------------------
