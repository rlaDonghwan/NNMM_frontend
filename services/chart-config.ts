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

  // console.log('[📊 chart item structure]', res.data)
  return res.data
}
//----------------------------------------------------------------------------------------------------
// 차트 순서 업데이트 함수
// 대시보드에서 차트 순서 업데이트
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
// 차트 상세 정보 호출 함수
// 대시보드에서 차트 상세 정보 호출
export const fetchChartDetail = async (dashboardId: string, chartId: string) => {
  console.log('[🔥 chart fetch 요청]', dashboardId, chartId) // 요청 전 로그 출력

  try {
    const res = await axios.patch(
      `${BASE_URL}/esg-dashboard/load-chart`,
      {dashboard: dashboardId, chartId},
      {withCredentials: true}
    )

    console.log('[✅ chart fetch 응답]', res.data) // 응답 데이터 로그 출력
    return res.data
  } catch (error) {
    console.error('[❌ chart fetch 실패]', error) // 에러 로그 출력
    throw error // 에러를 다시 던져서 호출한 곳에서 처리할 수 있게 함
  }
}

//----------------------------------------------------------------------------------------------------
// 즐겨찾기 토글 함수
// 대시보드에서 차트 즐겨찾기 토글
export const toggleFavoriteChart = async ({
  dashboardId,
  chartId,
  userId,
  isFavorite,
  onError
}: {
  dashboardId: string
  chartId: string
  userId: string
  isFavorite: boolean
  onError?: () => void
}) => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/esg-dashboard/favorite/${dashboardId}`,
      {
        chartId,
        isFavorite,
        userId
      },
      {withCredentials: true}
    )

    return res.status === 200
  } catch (error) {
    console.error('[❌ 즐겨찾기 토글 실패]', error)
    if (onError) onError()
    return false
  }
}
//----------------------------------------------------------------------------------------------------

// 차트 수정 함수
export const updateChart = async ({
  dashboardId,
  chartId,
  updateDto
}: {
  dashboardId: string
  chartId: string
  updateDto: any
}) => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/esg-dashboard/update-chart`,
      {
        dashboardId,
        chartId,
        updateDto
      },
      {
        withCredentials: true
      }
    )
    console.log('[✅ 차트 수정 성공]', res.data)
    return res.data
  } catch (error) {
    console.error('[❌ 차트 수정 실패]', error)
    throw error
  }
}

//----------------------------------------------------------------------------------------------------
// 차트 삭제 함수
export const deleteChart = async ({
  dashboardId,
  chartId
}: {
  dashboardId: string
  chartId: string
}) => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/esg-dashboard/delete-chart`,
      {
        dashboardId,
        chartId
      },
      {
        withCredentials: true
      }
    )
    console.log('[🗑️ 차트 삭제 성공]', res.data)
    return res.data
  } catch (error) {
    console.error('[❌ 차트 삭제 실패]', error)
    throw error
  }
}
//----------------------------------------------------------------------------------------------------
