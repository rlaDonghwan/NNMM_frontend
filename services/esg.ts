import axios from 'axios' // axios 라이브러리 임포트

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// 카테고리가 있는 경우 해당 카테고리의 지표를 가져오는 함수
export const fetchIndicators = async (category?: string) => {
  const url = category
    ? `${BASE_URL}/indicators?category=${category}` // 카테고리가 있으면 해당 URL 생성
    : `${BASE_URL}/indicators` // 카테고리가 없으면 기본 URL 생성
  const res = await axios.get(url) // URL로 GET 요청을 보냄
  return res.data // 응답 데이터를 반환
}
//----------------------------------------------------------------------------------------------------

// 새로운 지표를 생성하는 함수
export const createIndicators = async (
  newIndicators: {key: string; label: string; unit: string; category: string}[]
) => {
  const res = await axios.post(`${BASE_URL}/indicators`, newIndicators)
  return res.data
}
//----------------------------------------------------------------------------------------------------

// 단위와 함께 모든 지표들을 백엔드에 저장 (있으면 무시 or 업데이트, 없으면 생성)
export const syncIndicators = async (
  indicators: {key: string; label: string; unit: string}[]
) => {
  await Promise.all(
    indicators.map(ind => axios.post(`${BASE_URL}/indicators/check-or-create`, ind))
  )
}
//----------------------------------------------------------------------------------------------------

// ESG 보고서를 제출하는 함수
export const submitESGReport = async (report: any) => {
  try {
    const res = await axios.post(`${BASE_URL}/esg`, report, {
      withCredentials: true // ✅ 쿠키 포함 요청
    })
    return res.data
  } catch (error: any) {
    console.error('ESG 저장 실패:', error.response?.data || error.message)
    throw error
  }
}
//----------------------------------------------------------------------------------------------------

// services/esg.ts 안에 이 함수가 있어야 함
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
  category: 'social' | 'environmental' | 'governance'
) {
  return {
    companyName,
    category,
    indicators: rows.map(row => {
      const unit = indicators.find(i => i.key === row.indicatorKey)?.unit || ''
      return {
        indicatorKey: row.indicatorKey,
        unit,
        values: years.map(year => ({
          year,
          value: Number(row.values[year]) || 0,
          field1: row.field1 || '',
          field2: row.field2 || ''
        }))
      }
    })
  }
}
