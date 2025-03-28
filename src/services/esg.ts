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
  const res = await axios.post(`${BASE_URL}/esg-report`, report) // POST 요청으로 보고서 저장
  return res.data // 응답 데이터를 반환
}
//----------------------------------------------------------------------------------------------------
