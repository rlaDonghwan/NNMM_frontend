import {useState} from 'react'
import {Button} from '@/components/ui/button'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'

// ModalContent 컴포넌트의 Props 타입 정의
type ModalContentProps = {
  years: number[] // 연도 배열
  rows: {
    indicatorKey: string // 지표 키
    values: Record<number, string> // 연도별 값
    color: string // 색상
  }[] // 행 데이터 배열
  setRows: React.Dispatch<React.SetStateAction<any[]>> // 행 데이터를 업데이트하는 함수
  indicators: {key: string; label: string; unit: string}[] // 지표 배열
  setIndicators: React.Dispatch<
    React.SetStateAction<{key: string; label: string; unit: string}[]>
  > // 지표 배열을 업데이트하는 함수
  onAddYear: () => void // 연도를 추가하는 함수
  onRemoveYear: () => void // 연도를 제거하는 함수
  onRemoveRow: (index: number) => void // 특정 행을 제거하는 함수
  onValueChange: (rowIndex: number, year: number, value: string) => void // 특정 셀의 값을 변경하는 함수
  onIndicatorChange: (rowIndex: number, indicatorKey: string) => void // 특정 행의 지표를 변경하는 함수
  getUnit: (key: string) => string // 지표 키를 통해 단위를 가져오는 함수
  onAddRowWithIndicator: (indicatorKey: string) => void // 특정 지표를 가진 행을 추가하는 함수
  onSubmit: () => void // 제출 버튼 클릭 시 호출되는 함수
  onSubmitPage: () => void // 페이지 제출 버튼 클릭 시 호출되는 함수
}

export default function ModalContent({
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
  onSubmitPage
}: ModalContentProps) {
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]?.key || '')

  return (
    <div className="w-auto overflow-auto bg-white rounded-xl shadow p-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold">데이터 입력</h2>
      </div>

      {/* 아이콘 + 지표 콤보박스 */}
      <div className="flex items-center gap-4 mb-4">
        <ComboboxWithCreate
          items={indicators.map(ind => ind.label)}
          onAdd={newLabel => {
            const newKey = newLabel.toLowerCase().replace(/\s+/g, '-')
            setIndicators(prev => [...prev, {key: newKey, label: newLabel, unit: ''}])
            onAddRowWithIndicator(newKey)
            setSelectedIndicator(newKey)
          }}
          onSelect={label => {
            const indicator = indicators.find(ind => ind.label === label)
            if (indicator) {
              setSelectedIndicator(indicator.key)
              onAddRowWithIndicator(indicator.key)
            }
          }}
        />

        <button
          onClick={() => onAddRowWithIndicator(selectedIndicator)}
          className="w-6 h-6 bg-green-600 text-white rounded-full text-sm">
          +
        </button>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-1">
          <thead className="text-left text-gray-600 text-sm border-b">
            <tr>
              <th className="py-2 pl-2">&nbsp;</th>
              <th className="py-2"></th>
              <th className="py-2"></th>
              <th className="py-2"></th>
              <th className="py-2 text-center" colSpan={years.length}>
                <div className="flex justify-center items-center gap-2">
                  <span>연도</span>
                  <button
                    onClick={onAddYear}
                    className="w-5 h-5 rounded-full bg-black text-white text-sm flex items-center justify-center">
                    +
                  </button>
                  <button
                    onClick={onRemoveYear}
                    className="w-5 h-5 rounded-full bg-gray-400 text-white text-sm flex items-center justify-center">
                    -
                  </button>
                </div>
              </th>
              <th className="py-1">단위</th>
            </tr>
            <tr className="text-center text-gray-500">
              <th></th>
              <th>지표</th>
              <th>필드1</th>
              <th>필드2</th>
              {years.map(year => (
                <th key={year}>{year}</th>
              ))}
              <th></th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="bg-[#F8FAFC] text-center text-sm text-gray-700 rounded overflow-hidden">
                <td className="py-2">
                  <button
                    onClick={() => onRemoveRow(rowIndex)}
                    className="w-6 h-6 bg-red-400 text-white rounded-full">
                    -
                  </button>
                </td>
                <td className="px-2 text-left whitespace-nowrap">
                  {indicators.find(i => i.key === row.indicatorKey)?.label ||
                    row.indicatorKey}
                </td>
                <td className="px-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 rounded bg-white border"
                  />
                </td>
                <td className="px-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 rounded bg-white border"
                  />
                </td>

                {years.map(year => (
                  <td key={year} className="px-2">
                    <input
                      type="text"
                      value={row.values[year] || ''}
                      onChange={e => onValueChange(rowIndex, year, e.target.value)}
                      className="w-full px-2 py-1 rounded bg-white border"
                    />
                  </td>
                ))}

                <td className="px-2">
                  <ComboboxWithCreate
                    selected={indicators.find(i => i.key === row.indicatorKey)?.unit}
                    items={[...new Set(indicators.map(i => i.unit).filter(Boolean))]}
                    onAdd={newUnit => {
                      const key = row.indicatorKey
                      setIndicators(prev =>
                        prev.map(ind => (ind.key === key ? {...ind, unit: newUnit} : ind))
                      )
                    }}
                    onSelect={unit => {
                      const key = row.indicatorKey
                      setIndicators(prev =>
                        prev.map(ind => (ind.key === key ? {...ind, unit} : ind))
                      )
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end mt-6">
        <Button
          onClick={() => {
            console.log('[버튼 클릭됨]')
            if (onSubmitPage) {
              console.log('[onSubmitPage 존재함, 실행]')
              onSubmitPage() // 이게 setStep(2)인 함수죠
            } else {
              console.warn('[onSubmitPage없음]', onSubmitPage)
            }
          }}
          className="bg-gray-200 text-black text-lg px-8 py-2 rounded-full hover:bg-gray-300">
          다음 &gt;
        </Button>
      </div>
    </div>
  )
}
