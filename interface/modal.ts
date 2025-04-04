export interface ESGModalProps {
  category: 'social' | 'environmental' | 'governance'
}

export interface Indicator {
  key: string
  label: string
  unit: string
}

export interface Row {
  id: string
  indicatorKey: string
  values: Record<number, string>
  color: string
  field1?: string
  field2?: string
  unit?: string
}

export interface ModalContentProps {
  years: number[]
  setYears: React.Dispatch<React.SetStateAction<number[]>>
  rows: Row[]
  setRows: React.Dispatch<React.SetStateAction<Row[]>>
  indicators: Indicator[]
  setIndicators: React.Dispatch<React.SetStateAction<Indicator[]>>
  onRemoveYear: () => void
  onRemoveRow: (index: number) => void
  onValueChange: (rowIndex: number, year: number, value: string) => void
  getUnit: (key: string) => string
  onSubmit: () => void
  onAddRowWithIndicator: (indicatorKey: string) => void
  onSubmitPage: () => void
}

// ESGModalContextType 타입 정의
export interface ESGModalContextType {
  isModalOpen: boolean
  setIsModalOpen: (open: boolean, callback?: (chart: any) => void) => void
  isEditModalOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  onChartSaved: ((chart: any) => void) | null
  step: number
  setStep: React.Dispatch<React.SetStateAction<number>>
  rows: any[]
  setRows: React.Dispatch<React.SetStateAction<any[]>>
  years: number[]
  setYears: React.Dispatch<React.SetStateAction<number[]>>
  indicators: any[]
  setIndicators: React.Dispatch<React.SetStateAction<any[]>>
  chartToEdit: any | null
  setChartToEdit: React.Dispatch<React.SetStateAction<any | null>>
  reset: () => void
  openEditModal: (chart: any, callback?: (chart: any) => void) => void // ✅ 추가
}
export interface SecondModalContentProps {
  years: number[]
  setYears: React.Dispatch<React.SetStateAction<number[]>>
  rows: Row[]
  setRows: React.Dispatch<React.SetStateAction<Row[]>>
  indicators: Indicator[]
  setIndicators: React.Dispatch<React.SetStateAction<Indicator[]>>
  onAddYear: () => void
  onRemoveYear: () => void
  onRemoveRow: (index: number) => void
  onValueChange: (rowIndex: number, year: number, value: string) => void
  onAddRowWithIndicator: (indicatorKey: string) => void
  onIndicatorChange: (rowIndex: number, key: string) => void
  getUnit: (key: string) => string
  onSubmit: () => void
  onBack: () => void
  onSubmitPage: () => void // ✅ 이거 추가!
  chartType: string
  setChartType: React.Dispatch<React.SetStateAction<string>>
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  selectedRows: number[]
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>
  colorSet: string[]
  setColorSet: React.Dispatch<React.SetStateAction<string[]>>
  onChartSaved?: (chart: any) => void
}
