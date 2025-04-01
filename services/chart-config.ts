import axios from 'axios'

// 환경 변수에서 API 기본 URL 가져오기
const BASE_URL = process.env.NEXT_PUBLIC_API_URL

//----------------------------------------------------------------------------------------------------
// Row 타입 정의
type Row = {
  indicatorKey: string // 지표 키
  values: Record<number, string> // 연도별 값
  color: string // 색상
  field1?: string // 추가 필드 1
  field2?: string // 추가 필드 2
  unit?: string // 단위
}

//----------------------------------------------------------------------------------------------------
// 차트 설정 저장 함수
export const saveChartConfig = async ({
  chartType, // 차트 유형
  selectedRows, // 선택된 행의 인덱스 배열
  colorSet, // 색상 세트
  rows, // 전체 행 데이터
  indicators, // 지표 정보 배열
  years, // 연도 정보
  title, // 차트 제목
  category // 차트 카테고리
}: {
  chartType: string // 차트 유형
  selectedRows: number[] // 선택된 행의 인덱스 배열
  colorSet: string[] // 색상 세트
  rows: Row[] // 전체 행 데이터
  indicators: {key: string; label: string; unit?: string}[] // 지표 정보 배열
  years: {years: number[]; value: number[]} // 연도 정보
  title?: string // 차트 제목
  category: string // 차트 카테고리
}) => {
  // 선택된 행의 데이터를 키로 변환
  const targetDataKeys = selectedRows.map(i => {
    const row = rows[i]
    return [row.indicatorKey, row.field1, row.field2, row.unit].filter(Boolean).join('|')
  })

  // 선택된 행의 라벨 생성
  const labels = selectedRows.map(i => {
    const row = rows[i]
    const ind = indicators.find(ind => ind.key === row.indicatorKey)
    const parts = [row.field1, row.field2].filter(Boolean).join(' / ')
    const unit = ind?.unit || row.unit || ''
    return `${ind?.label || row.indicatorKey}${parts ? ` (${parts}` : ''}${
      parts && unit ? ` / ${unit})` : unit ? ` (${unit})` : parts ? ')' : ''
    }`
  })

  // 선택된 행의 단위 정보 생성
  const units = selectedRows.map(i => {
    const row = rows[i]
    return row.unit || indicators.find(ind => ind.key === row.indicatorKey)?.unit || ''
  })

  // 차트 설정을 서버에 POST 요청으로 저장
  return axios.post(
    `${BASE_URL}/chart`,
    {
      chartType, // 차트 유형
      targetDataKeys, // 데이터 키
      labels, // 라벨
      colorSet, // 색상 세트
      years, // 연도 정보
      units, // 단위 정보
      title, // 차트 제목
      category // 차트 카테고리
    },
    {withCredentials: true} // 인증 정보 포함
  )
}

//----------------------------------------------------------------------------------------------------

// 사용자 차트 호출 함수
// export const fetchUserCharts = async () => {
//   // 서버에서 사용자 차트 데이터 가져오기
//   const res = await axios.get(`${BASE_URL}/chart`, {withCredentials: true})
//   console.log('[fetchUserCharts] Response:', res.data) // 응답 데이터 로그 출력
//   return res.data // 응답 데이터 반환

//차트 호출
export const fetchUserCharts = async (category: string) => {
  const params = category ? {category} : {}

  const res = await axios.get(`${BASE_URL}/chart`, {
    withCredentials: true,
    params
  })

  console.log('[fetchUserChart] Response:', res.data)
  return res.data
}

//----------------------------------------------------------------------------------------------------

//차트 순서 불러오기

export const updateChartOrder = async (orderedIds: string[]) => {
  return axios.post(`${BASE_URL}/chart/order`, {orderedIds}, {withCredentials: true})
}
