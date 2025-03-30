import {useState} from 'react'
import {Button} from '@/components/ui/button'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'

type SecondModalContentProps = {
  years: number[]
  rows: {
    indicatorKey: string
    values: Record<number, string>
    color: string
  }[]
  setRows: React.Dispatch<React.SetStateAction<any[]>>
  indicators: {key: string; label: string; unit: string}[]
  setIndicators: React.Dispatch<
    React.SetStateAction<{key: string; label: string; unit: string}[]>
  >
  onAddYear: () => void
  onRemoveYear: () => void
  onRemoveRow: (index: number) => void
  onValueChange: (rowIndex: number, year: number, value: string) => void
  onIndicatorChange: (rowIndex: number, indicatorKey: string) => void
  getUnit: (key: string) => string
  onAddRowWithIndicator: (indicatorKey: string) => void
  onSubmit: () => void
  onSubmitPage: () => void
  onBack: () => void
}

export default function SecondModalContent({
  years,
  rows,
  setRows,
  indicators,
  setIndicators,
  onAddYear,
  onRemoveYear,
  onRemoveRow,
  onValueChange,
  getUnit,
  onAddRowWithIndicator,
  onSubmit,
  onSubmitPage,
  onBack
}: SecondModalContentProps) {
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]?.key || '')
  const [selectedChart, setSelectedChart] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [dataSelections, setDataSelections] = useState(Array(9).fill(''))

  const chartIcons = [
    'scatter',
    'bar',
    'candlestick',
    'area',
    'stackedBar',
    'horizontalBar',
    'line',
    'bubble',
    'pie'
  ]

  const colors = [
    '#F87171',
    '#EF4444',
    '#FB7185',
    '#B91C1C',
    '#F97316',
    '#FACC15',
    '#FBBF24',
    '#D97706',
    '#4ADE80',
    '#22C55E',
    '#10B981',
    '#14B8A6',
    '#38BDF8',
    '#3B82F6',
    '#8B5CF6',
    '#A855F7',
    '#6B7280',
    '#374151'
  ]

  const handleDataChange = (index, value) => {
    const updated = [...dataSelections]
    updated[index] = value
    setDataSelections(updated)
  }
  return (
    <div className="p-6 rounded-xl bg-white w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold">그래프 선택</h2>

      <div className="grid grid-cols-4 gap-6">
        {/* 그래프 종류 선택 */}
        <div className="col-span-1 space-y-2">
          <h3 className="font-medium">그래프 종류 선택</h3>
          <div className="grid grid-cols-3 gap-2">
            {chartIcons.map((type, i) => (
              <button
                key={type}
                className={`w-20 h-20 rounded-lg border flex items-center justify-center shadow-sm ${
                  selectedChart === type ? 'border-black' : 'border-gray-300'
                }`}
                onClick={() => setSelectedChart(type)}>
                <span className="text-sm">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 색상 선택 */}
        <div className="col-span-1 space-y-2">
          <h3 className="font-medium">색상 선택</h3>
          <div className="grid grid-cols-6 gap-2">
            {colors.map((color, i) => (
              <div
                key={i}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded cursor-pointer border-2 ${
                  selectedColor === color ? 'border-black' : 'border-transparent'
                }`}
                style={{backgroundColor: color}}
              />
            ))}
          </div>
        </div>

        {/* 데이터 선택 */}
        <div className="col-span-1 space-y-2">
          <h3 className="font-medium">데이터 선택</h3>
          <div className="grid grid-cols-3 gap-2">
            {dataSelections.map((sel, idx) => (
              <select
                key={idx}
                className="bg-yellow-100 px-2 py-1 rounded text-sm"
                value={sel}
                onChange={e => handleDataChange(idx, e.target.value)}>
                <option value="">구분</option>
                <option value="value1">value1</option>
                <option value="value2">value2</option>
              </select>
            ))}
          </div>
        </div>

        {/* 그래프 미리보기 */}
        <div className="col-span-1 space-y-2">
          <h3 className="font-medium">그래프 미리보기</h3>
          <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
            <svg className="w-40 h-40" viewBox="0 0 100 100">
              <path d="M10,90 L10,10 L90,90" stroke="black" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="w-auto bg-white rounded-xl shadow p-6">
        {/* 저장 버튼 */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={onBack}
            className="bg-gray-200 text-black text-lg px-8 py-2 rounded-full hover:bg-gray-300">
            &lt; 이전
          </Button>
          <Button
            onClick={onSubmitPage}
            className="bg-blue-300 text-black text-lg px-8 py-2 rounded-full hover:bg-blue-500">
            저장&#9745;
          </Button>
        </div>
      </div>
    </div>
  )
}
