import {useState, useEffect, useMemo} from 'react'
import {Button} from '@/components/ui/button'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'
import {transformRowsToEsgFormat, submitESGReport} from '@/services/esg-report'
import {usePathname} from 'next/navigation'
import {fetchCurrentUser} from '@/services/auth'
import {showWarning, showSuccess, showError} from '@/utils/toast'
import {createChartConfig} from '@/services/chart-config'

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
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({})

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
            // 기존 indicator 찾기
            const indicator = indicators.find(ind => ind.label === newLabel)

            const labelToUse = indicator ? indicator.label : newLabel

            setSelectedIndicator(labelToUse)
            onAddRowWithIndicator(labelToUse)
          }}
          onSelect={label => {
            setSelectedIndicator(label)
            onAddRowWithIndicator(label)
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
                      selected={selectedUnits[row.indicatorKey] || ''}
                      items={(() => {
                        const currentUnit = indicators.find(
                          i => i.label === row.indicatorKey
                        )?.unit
                        const units = [
                          ...new Set(indicators.map(i => i.unit).filter(Boolean))
                        ]
                        return currentUnit && !units.includes(currentUnit)
                          ? [...units, currentUnit]
                          : units
                      })()}
                      onAdd={newUnit => {
                        const label = row.indicatorKey

                        // 1. indicators 배열 업데이트
                        setIndicators(prev =>
                          prev.map(ind =>
                            ind.label === label ? {...ind, unit: newUnit} : ind
                          )
                        )

                        // 2. 선택 상태도 명확히 업데이트
                        setSelectedUnits(prev => ({...prev, [label]: newUnit}))
                      }}
                      onSelect={unit => {
                        const label = row.indicatorKey
                        setIndicators(prev =>
                          prev.map(ind => (ind.label === label ? {...ind, unit} : ind))
                        )
                        setSelectedUnits(prev => ({...prev, [label]: unit}))
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
          onClick={async () => {
            if (rows.length === 0 || years.length === 0) {
              showWarning('데이터를 입력해주세요.')
              return
            }

            try {
              // 차트 설정용 정보
              const targetDataKeys = rows.map(row => row.indicatorKey)
              const labels = targetDataKeys.map(key => {
                const label = indicators.find(i => i.key === key)?.label || key
                return label
              })

              // ✅ ESG 저장
              const esgPayload = transformRowsToEsgFormat(
                rows,
                indicators,
                years,
                companyName,
                category,
                'placeholder'
              )
              const esgReport = await submitESGReport(esgPayload)
              const reportId = esgReport._id

              // ✅ 차트 설정 저장
              const chartConfig = await createChartConfig({
                chartType: 'bar',
                targetDataKeys,
                labels,
                colorSet: '#3BAFDA',
                reportId
              })

              showSuccess('ESG 보고서와 차트가 성공적으로 저장되었습니다!')
              onSubmitPage?.(chartConfig._id)
            } catch (error: any) {
              console.error('❌ 저장 실패:', error.response?.data || error.message)
              showError('저장 중 오류가 발생했습니다.')
            }
          }}>
          다음 &gt;
        </Button>
      </div>
    </div>
  )
}
