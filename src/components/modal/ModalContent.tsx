import {useState, useEffect} from 'react'

import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'

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
  getUnit: (key: string) => string
  onSubmit: () => void
  onAddRowWithIndicator: (indicatorKey: string) => void
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
  onSubmit,
  onAddRowWithIndicator
}: ModalContentProps) {
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]?.key || '')
  useEffect(() => {
    if (rows.length === 0) return

    const updated = [...rows]
    updated[rows.length - 1].indicatorKey = selectedIndicator
    setRows(updated)
  }, [selectedIndicator])

  return (
    <div className="space-y-6">
      {/* 상단 - 지표 선택 및 버튼 */}
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
            onClick={() => onAddRowWithIndicator(selectedIndicator)}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm">
            + 행 추가
          </button>
        </div>

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

      {/* 테이블 */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">지표</th>
            {years.map(year => (
              <th key={year} className="p-2 border">
                {year}
              </th>
            ))}
            <th className="p-2 border">단위</th>
            <th className="p-2 border">색상</th>
            <th className="p-2 border">삭제</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {/* 지표 라벨 */}
              <td className="p-2 border text-sm text-gray-700">
                {indicators.find(i => i.key === row.indicatorKey)?.label ||
                  row.indicatorKey}
              </td>

              {/* 연도별 값 입력 */}
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
              <td className="p-2 border text-center">
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
