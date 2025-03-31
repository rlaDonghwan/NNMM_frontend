import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// ✅ ESG 보고서를 제출하는 함수 (esg-report로 변경됨)
export const submitESGReport = async (report: any) => {
  try {
    const res = await axios.post(`${BASE_URL}/esg-report`, report, {
      withCredentials: true
    })
    return res.data
  } catch (error: any) {
    console.error('❌ ESG 저장 실패: ', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${BASE_URL}/esg-report` // 이 부분도 같이 바꿔줌
    })
    throw error
  }
}

//----------------------------------------------------------------------------------------------------

export function transformRowsToEsgFormat(
  rows: {
    indicatorKey: string
    values: Record<number, string>
    color: string
    field1?: string
    field2?: string
  }[],
  indicators: {key: string; label: string; unit: string}[],
  years: number[],
  companyName: string,
  category: 'social' | 'environmental' | 'governance',
  chartConfigId: string
) {
  return {
    companyName,
    category,
    years,
    chartConfigId,
    rows: rows.map(row => {
      const unit = indicators.find(i => i.key === row.indicatorKey)?.unit || ''
      const valueRecord: Record<number, string> = {}
      years.forEach(year => {
        valueRecord[year] = row.values[year] || '0'
      })

      return {
        indicatorKey: row.indicatorKey,
        values: valueRecord,
        color: row.color,
        field1: row.field1 || '',
        field2: row.field2 || '',
        unit
      }
    })
  }
}
