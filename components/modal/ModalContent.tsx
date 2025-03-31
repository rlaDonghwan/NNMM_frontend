import {useState, useEffect, useMemo} from 'react'
import {Button} from '@/components/ui/button'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'
import {transformRowsToEsgFormat, submitESGReport} from '@/services/esg'
import {usePathname} from 'next/navigation'
import {fetchCurrentUser} from '@/services/auth'
import {showWarning, showSuccess, showError} from '@/utils/toast'
import {createIndicatorIfNotExists} from '@/services/indicator'

interface Row {
  indicatorKey: string
  values: Record<number, string>
  color: string
  field1?: string
  field2?: string
}

interface ModalContentProps {
  years: number[]
  setYears: React.Dispatch<React.SetStateAction<number[]>>
  rows: Row[]
  setRows: React.Dispatch<React.SetStateAction<Row[]>>
  indicators: {key: string; label: string; unit: string}[]
  setIndicators: React.Dispatch<
    React.SetStateAction<{key: string; label: string; unit: string}[]>
  >
  onRemoveYear: () => void
  onRemoveRow: (index: number) => void
  onValueChange: (rowIndex: number, year: number, value: string) => void
  onAddRowWithIndicator: (indicatorKey: string) => void
  getUnit: (key: string) => string
  onSubmit: () => void
  onSubmitPage?: (id?: string) => void
}

export default function ModalContent({
  years,
  setYears,
  rows,
  setRows,
  indicators,
  setIndicators,
  onRemoveYear,
  onRemoveRow,
  onValueChange,
  getUnit,
  onAddRowWithIndicator,
  onSubmitPage
}: ModalContentProps) {
  const pathname = usePathname()
  const category = pathname.includes('social')
    ? 'social'
    : pathname.includes('environmental')
    ? 'environmental'
    : 'governance'

  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]?.key || '')
  const [companyName, setCompanyName] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const yearOptions = useMemo(() => {
    const startYear = 2025
    const options: string[] = []
    for (let y = startYear; y >= 1900; y--) {
      options.push(`${y}`)
    }
    return options
  }, [])

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const user = await fetchCurrentUser()
        setCompanyName(user.companyName)
      } catch (err) {
        console.error('사용자 정보 불러오기 실패:', err)
      }
    }
    getUserInfo()
  }, [])

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

  const removeYearByValue = (year: number) => {
    setYears(prev => prev.filter(y => y !== year))
  }

  return (
    <div className="w-auto overflow-auto bg-white rounded-xl shadow p-5">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h2 className="text-2xl font-apple">데이터 입력</h2>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <ComboboxWithCreate
          items={indicators.map(ind => ind.label)}
          placeholder="항목 선택"
          onAdd={async newLabel => {
            try {
              const created = await createIndicatorIfNotExists(newLabel)
              setIndicators(prev => [...prev, created])
              onAddRowWithIndicator(created.key)
              setSelectedIndicator(created.key)
            } catch (err) {
              console.error('인디케이터 생성 실패:', err)
            }
          }}
          onSelect={label => {
            const indicator = indicators.find(ind => ind.label === label)
            if (indicator) {
              setSelectedIndicator(indicator.key)
              onAddRowWithIndicator(indicator.key)
            }
          }}
        />
        <ComboboxWithCreate
          items={yearOptions}
          placeholder="연도 선택"
          onSelect={handleYearSelect}
          onAdd={handleYearSelect}
        />
      </div>

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
                      selected={indicators.find(i => i.key === row.indicatorKey)?.unit}
                      items={[...new Set(indicators.map(i => i.unit).filter(Boolean))]}
                      onAdd={newUnit => {
                        const key = row.indicatorKey
                        setIndicators(prev =>
                          prev.map(ind =>
                            ind.key === key ? {...ind, unit: newUnit} : ind
                          )
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
                  {years.map(year => (
                    <td key={year} className="px-2">
                      <input
                        type="text"
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

      <div className="flex justify-end mt-6">
        <Button
          onClick={() => {
            onSubmitPage?.() // 그냥 페이지 넘기기만
          }}
          className="bg-gray-200 text-black text-lg px-8 py-2 rounded-full hover:bg-gray-300 font-apple">
          다음 &gt;
        </Button>
      </div>
    </div>
  )
}
