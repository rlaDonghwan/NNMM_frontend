import {useEffect, useState, useMemo} from 'react'
import {Button} from '@/components/ui/button'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'
import {usePathname} from 'next/navigation'
import {showWarning, showSuccess} from '@/utils/toast'
import {ModalContentProps} from '@/interface/modal'
import {useESGModal} from './ESGModalContext'

export default function UnifiedModalContent({
  years,
  setYears,
  rows,
  setRows,
  indicators,
  setIndicators,
  onRemoveRow,
  onAddRowWithIndicator,
  onSubmitPage,
  setSelectedRows
}: ModalContentProps) {
  const pathname = usePathname()
  const category = pathname.includes('social')
    ? 'social'
    : pathname.includes('environmental')
    ? 'environmental'
    : 'governance'

  const {isEditModalOpen, chartToEdit} = useESGModal()
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]?.key || '')
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({})
  const yearOptions = useMemo(() => {
    const startYear = 2025
    const options: string[] = []
    for (let y = startYear; y >= 1900; y--) {
      options.push(`${y}`)
    }
    return options
  }, [])
  //----------------------------------------------------------------------------------------------------
  // 연도 추가
  const handleYearSelect = (year: string) => {
    const parsed = parseInt(year)
    if (!isNaN(parsed)) {
      if (years.includes(parsed)) {
        showWarning('이미 추가된 연도입니다!')
      } else if (years.length >= 5) {
        showWarning('최대 5개의 연도만 추가할 수 있습니다!')
      } else {
        setYears(prev => [...prev, parsed].sort((a, b) => a - b))
        showSuccess('연도가 추가되었습니다!')
      }
    }
  }
  //----------------------------------------------------------------------------------------------------

  // 연도 삭제
  const removeYearByValue = (year: number) => {
    setYears(prev => prev.filter(y => y !== year))
  }
  //----------------------------------------------------------------------------------------------------

  // 데이터 수정 시 기존 값을 기반으로 입력 필드 값 채우기
  const onValueChange = (rowIndex: number, year: number, value: string) => {
    const updatedRows = [...rows]
    if (!updatedRows[rowIndex].values) {
      updatedRows[rowIndex].values = {}
    }
    updatedRows[rowIndex].values[year] = value
    setRows(updatedRows)
  }
  //----------------------------------------------------------------------------------------------------

  // 데이터 수정 시 기존 값을 기반으로 입력 필드 값 채우기
  useEffect(() => {
    if (isEditModalOpen && chartToEdit) {
      setYears(chartToEdit.years || [])

      const updatedRows = chartToEdit.fields.map(field => ({
        id: field._id || crypto.randomUUID(),
        indicatorKey: field.key,
        field1: field.field1 || '',
        field2: field.field2 || '',
        values: Object.fromEntries(
          (chartToEdit.years || []).map(year => [
            year,
            field.data[year] !== undefined ? String(field.data[year]) : ''
          ])
        ),
        color: field.color || '#cccccc',
        unit: field.unit || chartToEdit.unit || ''
      }))

      setRows(updatedRows)
    }
  }, [isEditModalOpen, chartToEdit])
  //----------------------------------------------------------------------------------------------------

  // 데이터 추가 시 기존 값 기반으로 입력 필드 값 채우기
  useEffect(() => {
    setSelectedRows?.(prev => prev.filter(i => i >= 0 && i < rows.length))
  }, [rows])
  //----------------------------------------------------------------------------------------------------
  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h2 className="font-apple text-2xl">
          {chartToEdit ? '데이터 수정' : '데이터 입력'}
        </h2>
      </div>

      {/* 지표 및 연도 선택 */}
      <div className="flex items-center gap-4 mb-4">
        <ComboboxWithCreate
          items={indicators.map(ind => ind.label)}
          placeholder="항목 선택"
          onAdd={async newLabel => {
            const indicator = indicators.find(ind => ind.label === newLabel)
            const keyToUse = indicator ? indicator.key : newLabel
            setSelectedIndicator(keyToUse)
            onAddRowWithIndicator(keyToUse)
          }}
          onSelect={label => {
            const ind = indicators.find(ind => ind.label === label)
            const keyToUse = ind ? ind.key : label
            setSelectedIndicator(keyToUse)
            onAddRowWithIndicator(keyToUse)
          }}
        />

        <ComboboxWithCreate
          items={yearOptions}
          placeholder="연도 선택"
          onSelect={handleYearSelect}
          onAdd={handleYearSelect}
        />
      </div>

      {/* 데이터 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-1">
          <thead className="text-center text-gray-600 text-sm border-b font-apple">
            <tr>
              <th></th>
              <th>항목</th>
              <th>대분류</th>
              <th>중분류</th>
              <th>단위</th>
              {years.map(year => (
                <th key={year} className="py-2">
                  <div className="flex flex-col items-center relative">
                    <button
                      onClick={() => removeYearByValue(year)}
                      className="w-5 h-5 bg-red-400 text-white rounded-full text-xs mb-1 font-apple">
                      -
                    </button>
                    <span>{year}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr className="bg-[#F8FAFC] text-center text-sm text-gray-400 font-apple">
                <td className="py-4" colSpan={5 + years.length}>
                  지표를 추가하면 여기에 데이터가 추가됩니다.
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="text-center text-sm text-gray-700 font-apple">
                  <td>
                    <button
                      onClick={() => onRemoveRow(rowIndex)}
                      className="w-6 h-6 bg-red-400 text-white rounded-full font-apple">
                      -
                    </button>
                  </td>
                  <td className="px-2 text-left">
                    {indicators.find(i => i.key === row.indicatorKey)?.label ||
                      row.indicatorKey}
                  </td>
                  <td className="px-2">
                    <input
                      type="text"
                      value={row.field1 || ''}
                      placeholder="ex: 항공부분"
                      onChange={e => {
                        const updated = [...rows]
                        updated[rowIndex].field1 = e.target.value
                        setRows(updated)
                      }}
                      className="w-full px-2 py-1 border rounded font-apple"
                    />
                  </td>
                  <td className="px-2">
                    <input
                      type="text"
                      value={row.field2 || ''}
                      placeholder="ex: 국내선 (선택)"
                      onChange={e => {
                        const updated = [...rows]
                        updated[rowIndex].field2 = e.target.value
                        setRows(updated)
                      }}
                      className="w-full px-2 py-1 border rounded font-apple"
                    />
                  </td>
                  <td className="px-2">
                    <ComboboxWithCreate
                      selected={
                        row.unit ||
                        indicators.find(i => i.key === row.indicatorKey)?.unit ||
                        ''
                      }
                      items={(() => {
                        const units = [
                          ...new Set(indicators.map(i => i.unit).filter(Boolean))
                        ]
                        const currentUnit = indicators.find(
                          i => i.key === row.indicatorKey
                        )?.unit
                        return currentUnit && !units.includes(currentUnit)
                          ? [...units, currentUnit]
                          : units
                      })()}
                      onAdd={newUnit => {
                        const key = row.indicatorKey
                        setIndicators(prev =>
                          prev.map(ind =>
                            ind.key === key ? {...ind, unit: newUnit} : ind
                          )
                        )
                        setSelectedUnits(prev => ({...prev, [key]: newUnit}))
                        setRows(prev =>
                          prev.map(r =>
                            r.indicatorKey === key ? {...r, unit: newUnit} : r
                          )
                        )
                      }}
                      onSelect={unit => {
                        const key = row.indicatorKey
                        setIndicators(prev =>
                          prev.map(ind => (ind.key === key ? {...ind, unit} : ind))
                        )
                        setSelectedUnits(prev => ({...prev, [key]: unit}))
                        setRows(prev =>
                          prev.map(r => (r.indicatorKey === key ? {...r, unit} : r))
                        )
                      }}
                    />
                  </td>
                  {years.map(year => (
                    <td key={year} className="px-2">
                      <input
                        type="number"
                        value={row.values[year] || ''}
                        onChange={e => onValueChange(rowIndex, year, e.target.value)}
                        className="w-[80px] px-2 py-1 rounded border font-apple"
                      />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end w-full mt-4 gap-2">
        <Button
          onClick={() => {
            if (rows.length === 0 || years.length === 0) {
              showWarning('데이터를 입력해주세요.')
              return
            }

            const hasEmptyValue = rows.some(row =>
              years.some(year => !row.values[year] || row.values[year].trim() === '')
            )

            if (hasEmptyValue) {
              showWarning('모든 연도에 값을 입력해주세요.')
              return
            }

            onSubmitPage?.()
          }}
          className="bg-gray-300 hover:bg-gray-200 text-black px-4 py-2 font-apple">
          다음 &gt;
        </Button>
      </div>
    </div>
  )
}
