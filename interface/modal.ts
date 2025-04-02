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

export interface ESGModalContextType {
  isModalOpen: boolean
  setIsModalOpen: (open: boolean, callback?: (chart: any) => void) => void // ✅ 이렇게 수정!
  step: number
  setStep: React.Dispatch<React.SetStateAction<number>>
  rows: Row[]
  setRows: React.Dispatch<React.SetStateAction<Row[]>>
  years: number[]
  setYears: React.Dispatch<React.SetStateAction<number[]>>
  indicators: Indicator[]
  setIndicators: React.Dispatch<React.SetStateAction<Indicator[]>>
  onChartSaved: ((chart: any) => void) | null
  reset: () => void
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
  onSubmitPage: (id?: string) => void
  onChartSaved?: (chart: any) => void
  chartType: string
  setChartType: React.Dispatch<React.SetStateAction<string>>
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  selectedRows: number[]
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>
  colorSet: string[]
  setColorSet: React.Dispatch<React.SetStateAction<string[]>>
}
