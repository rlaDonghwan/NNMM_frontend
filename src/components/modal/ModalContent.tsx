import {useState} from 'react'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'

//props 타입 정의: 부모 컴포넌트에서 넘겨줄 데이터와 함수들
type ModalContentProps = {
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
  onColorChange: (rowIndex: number, color: string) => void
  getUnit: (key: string) => string
  onSubmit: () => void
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
  onSubmit
}: ModalContentProps) {
  // 사용자가 select box로 선택한 현재 지표 상태
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]?.key || '')

  // 선택된 지표로 새로운 row를 rows에 추가하는 함수
  const addRowWithIndicator = () => {
    const newRow = {
      indicatorKey: selectedIndicator,
      values: years.reduce((acc, y) => ({...acc, [y]: ''}), {}),
      color: '#cccccc'
    }
    setRows([...rows, newRow])
  }

  return (
    <div className="space-y-6">
      {/* 상단 - 지표 선택 + 행 추가 버튼 */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          {/* 지표 선택 드롭다운 → 커스텀 콤보박스로 변경 */}
          <ComboboxWithCreate
            items={indicators.map(ind => ind.label)}
            onAdd={newLabel => {
              const newKey = newLabel.toLowerCase().replace(/\s+/g, '-')
              setIndicators(prev => [...prev, {key: newKey, label: newLabel, unit: ''}])
              setRows(prev => [
                ...prev,
                {
                  indicatorKey: newKey,
                  values: years.reduce((acc, y) => ({...acc, [y]: ''}), {}),
                  color: '#cccccc'
                }
              ])
              setSelectedIndicator(newKey)
            }}
            onSelect={label => {
              const key = label

              setSelectedIndicator(label)
              const newRow = {
                indicatorKey: key,
                values: years.reduce((acc, y) => ({...acc, [y]: ''}), {}),
                color: '#cccccc'
              }
              setRows(prev => [...prev, newRow])
            }}
          />

          {/* 행 추가 버튼 */}
          <button
            onClick={addRowWithIndicator}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm">
            + 행 추가
          </button>
        </div>

        {/* 연도 추가/삭제 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={onAddYear}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded">
            + 연도
          </button>
          <button
            onClick={onRemoveYear}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded">
            - 연도
          </button>
        </div>
      </div>

      {/* 입력 테이블 */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">지표</th>
            <th className="p-2 border">필드1</th>
            <th className="p-2 border">필드2</th>
            {years.map(year => (
              <th key={year} className="p-2 border">
                {year}
              </th>
            ))}
            <th className="p-2 border">단위</th>
            <th className="p-2 border">삭제</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {/* 지표 이름 */}
              <td className="p-2 w-auto border text-sm text-gray-700 whitespace-nowrap">
                {indicators.find(i => i.key === row.indicatorKey)?.label ||
                  row.indicatorKey}
              </td>
              <td className="p-2 border text-sm">
                <input type="text" />
              </td>
              <td className="p-2 border text-sm">
                <input type="text" />
              </td>

              {/* 연도별 값 입력 필드 */}
              {years.map(year => (
                <td key={year} className="p-2 border">
                  <input
                    type="text"
                    value={row.values[year]}
                    onChange={e => onValueChange(rowIndex, year, e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
              ))}

              {/* 단위 표시 */}
              <td className="p-2 border text-center">
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

              {/* 행 삭제 버튼 */}
              <td className="p-2 border text-center w-10">
                <button
                  onClick={() => onRemoveRow(rowIndex)}
                  className="text-red-500 hover:underline text-xs">
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 저장 버튼 */}
      <div className="flex justify-center mt-6">
        <button
          onClick={onSubmit}
          className="bg-blue-400 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm">
          저장
        </button>
      </div>
    </div>
  )
}
