import axios from 'axios'

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
