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
  // const [selectedColor, setSelectedColor] = useState(null)
  const [selectedColor, setSelectedColor] = useState<string[]>(['#60A5FA', '#F472B6'])
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
  // 색바꾸기용 함수
  const handleColorChange = (index: number, newColor: string) => {
    setSelectedColor(prev => {
      const updated = [...prev]
      updated[index] = newColor
      return updated
    })
  }

  const handleDataChange = (index, value) => {
    const updated = [...dataSelections]
    updated[index] = value
    setDataSelections(updated)
  }
  return (
    <div className="p-6 rounded-xl bg-white w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold">그래프 선택</h2>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* 그래프 종류 선택 */}
        <div className="col-span-1 space-y-2">
          <h3 className="font-apple">그래프 종류 선택</h3>
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

        {/* 데이터 선택 */}
        <div className="col-span-1 space-y-2">
          <h3 className="font-apple">데이터 선택</h3>
          {/* 색상 선택 */}
          <div className="flex flex-col gap-2">
            {[0, 1].map(index => (
              <div key={index} className="flex items-center gap-2">
                <select className="flex-1 border rounded px-2 py-1">
                  <option value="value1">value1</option>
                  <option value="value2">value2</option>
                </select>
                <input
                  type="color"
                  className="w-6 h-6 border rounded"
                  value={selectedColor[index]}
                  onChange={e => handleColorChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 그래프 미리보기 ,,,*/}
        <div className="col-span-1 space-y-2">
          <h3 className="font-apple">그래프 미리보기</h3>
          <div className="bg-gray-100 w-[28.5vw] rounded-xl h-64 flex items-center justify-center">
            <svg className="w-40 h-40" viewBox="0 0 100 100">
              <path d="M10,90 L10,10 L90,90" stroke="black" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="w-auto bg-white rounded-xl shadow p-6">
        {/* 저장 버튼 */}
        <div className="flex justify-end mt-6 gap-3">
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
