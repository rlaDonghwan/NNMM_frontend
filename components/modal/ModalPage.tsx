'use client'
import {useState} from 'react'
import {Button} from '@/components/ui/button'
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
  onIndicatorChange: (rowIndex: number, indicatorKey: string) => void
  getUnit: (key: string) => string
  onAddRowWithIndicator: (indicatorKey: string) => void
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
  onAddRowWithIndicator,
  onSubmit
}: ModalContentProps) {
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]?.key || '')

  return (
    <div className="w-[1280px] bg-white rounded-xl shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold">데이터 입력</h2>
        <button className="text-gray-400 hover:text-black font-apple text-xl">
          &times;
        </button>
      </div>

      {/* 아이콘 + 지표 콤보박스 */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center">
          <img src="/icon/esg-icon.svg" alt="icon" className="w-6 h-6" />
        </div>

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
          className="bg-green-600 text-white px-4 py-2 rounded text-sm">
          + 행 추가
        </button>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-1">
          <thead className="text-left text-gray-600 text-sm border-b">
            <tr>
              <th className="py-2 pl-2">&nbsp;</th>
              <th className="py-2">지표</th>
              <th className="py-2">필드1</th>
              <th className="py-2">필드2</th>
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
              <th className="py-2">단위</th>
            </tr>
            <tr className="text-center text-gray-500">
              <th></th>
              <th></th>
              <th></th>
              <th></th>
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
                    className="w-6 h-6 bg-blue-400 text-white rounded-full">
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
          onClick={onSubmit}
          className="bg-gray-200 text-black text-lg px-8 py-2 rounded-full hover:bg-gray-300">
          다음 &gt;
        </Button>
      </div>
    </div>
  )
}
