// ESG 모달에 전달되는 props (카테고리 및 저장 콜백)
export interface ESGModalProps {
  category: 'social' | 'environmental' | 'governance' // ESG 카테고리 지정
  onChartSaved?: (chart: any) => void // 차트 저장 후 콜백 (선택)
}
//-----------------------------------------------------------------------------------------

// ESG 지표(indicator) 하나를 나타내는 타입
export interface Indicator {
  key: string // 지표 고유 키
  label: string // 사용자에게 보여질 지표 이름
  unit: string // 지표의 단위 (예: %, ton 등)
}
//----------------------------------------------------------------------------------------------------

// 모달 내에서 입력되는 하나의 지표(Row) 정보를 나타냄
export interface Row {
  id: string // 행 고유 ID (UUID 등)
  indicatorKey: string // 연결된 지표 키 (Indicator.key)
  values: Record<number, string> // 연도별 값 (예: {2021: '10', 2022: '20'})
  color: string // 차트에서 사용되는 색상 값 (HEX)
  field1?: string // 선택적 서브 필드 1 (예: 부서, 범주 등)
  field2?: string // 선택적 서브 필드 2 (예: 지역 등)
  unit?: string // 단위 (지표 단위 덮어쓰기 가능)
}
//----------------------------------------------------------------------------------------------------

// ESG 모달 1단계 (지표 및 값 입력) 컴포넌트의 props
export interface ModalContentProps {
  years: number[] // 선택된 연도 리스트
  setYears: React.Dispatch<React.SetStateAction<number[]>> // 연도 상태 업데이트 함수

  rows: Row[] // 입력된 지표 Row 목록
  setRows: React.Dispatch<React.SetStateAction<Row[]>> // Row 상태 업데이트 함수

  indicators: Indicator[] // 사용 가능한 지표 목록
  setIndicators: React.Dispatch<React.SetStateAction<Indicator[]>> // 지표 목록 갱신 함수

  setSelectedRows?: React.Dispatch<React.SetStateAction<number[]>> // 선택된 지표 인덱스 (차트용)

  onRemoveYear: () => void // 연도 제거 핸들러
  onRemoveRow: (index: number) => void // 행(Row) 제거 핸들러
  onValueChange: (rowIndex: number, year: number, value: string) => void // 값 변경 핸들러
  getUnit: (key: string) => string // 지표 단위 조회 함수
  onSubmit: () => void // 제출 핸들러 (저장 용)
  onAddRowWithIndicator: (indicatorKey: string) => void // 지표 추가 핸들러
  onSubmitPage: () => void // 2단계 이동 핸들러
}
//----------------------------------------------------------------------------------------------------

// ESG 모달 2단계 (차트 설정) 컴포넌트의 props
export interface SecondModalContentProps {
  years: number[] // 연도 리스트
  setYears: React.Dispatch<React.SetStateAction<number[]>> // 연도 상태 업데이트 함수

  rows: Row[] // 입력된 지표 Row 목록
  setRows: React.Dispatch<React.SetStateAction<Row[]>> // Row 상태 업데이트 함수

  indicators: Indicator[] // 사용 가능한 지표 목록
  setIndicators: React.Dispatch<React.SetStateAction<Indicator[]>> // 지표 상태 업데이트

  onAddYear: () => void // 연도 추가
  onRemoveYear: () => void // 연도 제거
  onRemoveRow: (index: number) => void // 행(Row) 제거
  onValueChange: (rowIndex: number, year: number, value: string) => void // 값 변경
  onAddRowWithIndicator: (indicatorKey: string) => void // 지표 추가
  onIndicatorChange: (rowIndex: number, key: string) => void // 지표 변경
  getUnit: (key: string) => string // 단위 반환 함수

  onSubmit: () => void // 차트 저장 요청 핸들러
  onBack: () => void // 이전 단계 이동 핸들러
  onSubmitPage: () => void // 저장 또는 최종 제출 핸들러

  chartType: string // 선택된 차트 타입 (bar, pie 등)
  setChartType: React.Dispatch<React.SetStateAction<string>> // 차트 타입 설정 함수

  title: string // 차트 제목
  setTitle: React.Dispatch<React.SetStateAction<string>> // 제목 설정 함수

  selectedRows: number[] // 선택된 Row 인덱스 목록
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>> // 선택 인덱스 설정

  colorSet: string[] // 각 지표의 색상 배열
  setColorSet: React.Dispatch<React.SetStateAction<string[]>> // 색상 설정 함수

  onChartSaved?: (chart: any) => void // 차트 저장 완료 후 콜백
  closeModal?: () => void // 모달 닫기 함수
  refetchCharts?: () => void // 차트 새로고침 트리거 함수
}
//----------------------------------------------------------------------------------------------------

// ESG 입력/수정 모달의 전역 상태를 관리하는 Context 타입
export interface ESGModalContextType {
  isModalOpen: boolean // 모달 열림 여부
  setIsModalOpen: (open: boolean, callback?: (chart: any) => void) => void // 모달 열기 + 콜백 등록
  isEditModalOpen: boolean // 수정 모드 여부
  setIsEditModalOpen: (open: boolean) => void // 수정 모드 토글 함수
  isGoalModalOpen: boolean // 목표 설정 모달 열림 여부
  setIsGoalModalOpen: (open: boolean) => void
  onChartSaved: ((chart: any) => void) | null // 저장 후 콜백 함수
  step: number // 현재 단계 (1 or 2)
  setStep: React.Dispatch<React.SetStateAction<number>> // 단계 설정 함수

  rows: any[] // 현재 입력된 Row 목록
  setRows: React.Dispatch<React.SetStateAction<any[]>> // Row 설정

  years: number[] // 선택된 연도 목록
  setYears: React.Dispatch<React.SetStateAction<number[]>> // 연도 설정

  indicators: any[] // 현재 지표 목록
  setIndicators: React.Dispatch<React.SetStateAction<any[]>> // 지표 설정

  chartToEdit: any | null // 수정 중인 차트 정보
  setChartToEdit: React.Dispatch<React.SetStateAction<any | null>> // 수정 차트 설정

  reset: () => void // 모든 상태 초기화
  openEditModal: (chart: any, callback?: (chart: any) => void) => void // 수정 모달 열기
  setIsModalOpenWithCallback?: (open: boolean, callback: (chart: any) => void) => void // (옵션) 콜백 포함 열기
}
//----------------------------------------------------------------------------------------------------
