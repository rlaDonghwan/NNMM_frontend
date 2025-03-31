import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// 지표 생성 함수 (group 제거됨)
export const createIndicatorIfNotExists = async (label, unit, category) => {
  try {
    console.log('📡 POST 요청:', {label, unit, category})
    const res = await axios.post(`${BASE_URL}/indicators/${category}/check-or-create`, {
      label,
      unit
    })
    console.log('📥 응답 받음:', res.data)
    return res.data
  } catch (error) {
    console.error('❌ 인디케이터 생성 실패:', error.response?.data || error.message)
    throw error
  }
}

//----------------------------------------------------------------------------------------------------

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
