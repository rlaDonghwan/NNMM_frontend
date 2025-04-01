import {useState, useEffect, useMemo} from 'react' // React의 훅들 import
import {Button} from '@/components/ui/button' // Button 컴포넌트 import
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate' // ComboboxWithCreate 컴포넌트 import
import {usePathname} from 'next/navigation' // 현재 경로를 가져오는 Next.js 훅 import
import {showWarning, showSuccess} from '@/utils/toast' // 알림 메시지 유틸리티 함수 import

// Row 인터페이스 정의
interface Row {
  indicatorKey: string // 지표 키
  values: Record<number, string> // 연도별 값
  color: string // 색상
  field1?: string // 추가 필드 1
  field2?: string // 추가 필드 2
  unit?: string // 단위
}

// ModalContent 컴포넌트의 props 인터페이스 정의
interface ModalContentProps {
  years: number[] // 연도 배열
  setYears: React.Dispatch<React.SetStateAction<number[]>> // 연도 상태 업데이트 함수
  rows: Row[] // 행 데이터 배열
  setRows: React.Dispatch<React.SetStateAction<Row[]>> // 행 데이터 상태 업데이트 함수
  indicators: {key: string; label: string; unit: string}[] // 지표 배열
  setIndicators: React.Dispatch<
    React.SetStateAction<{key: string; label: string; unit: string}[]>
  > // 지표 상태 업데이트 함수
  onRemoveYear: () => void // 연도 제거 함수
  onRemoveRow: (index: number) => void // 행 제거 함수
  onValueChange: (rowIndex: number, year: number, value: string) => void // 값 변경 함수
  onAddRowWithIndicator: (indicatorKey: string) => void // 지표를 기반으로 행 추가 함수
  getUnit: (key: string) => string // 단위 가져오기 함수
  onSubmit: () => void // 제출 함수
  onSubmitPage?: (id?: string) => void // 페이지 제출 함수
}

// ModalContent 컴포넌트 정의
export default function ModalContent({
  years, // 연도 배열
  setYears, // 연도 상태 업데이트 함수
  rows, // 행 데이터 배열
  setRows, // 행 데이터 상태 업데이트 함수
  indicators, // 지표 배열
  setIndicators, // 지표 상태 업데이트 함수
  onRemoveRow, // 행 제거 함수
  onAddRowWithIndicator, // 지표를 기반으로 행 추가 함수
  onSubmitPage // 페이지 제출 함수
}: ModalContentProps) {
  const pathname = usePathname() // 현재 경로 가져오기
  const category = pathname.includes('social') // 경로에 따라 카테고리 설정
    ? 'social'
    : pathname.includes('environmental')
    ? 'environmental'
    : 'governance'

  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]?.key || '') // 선택된 지표 상태
  const [companyName, setCompanyName] = useState('') // 회사 이름 상태
  const [selectedYear, setSelectedYear] = useState('') // 선택된 연도 상태
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({}) // 선택된 단위 상태

  const yearOptions = useMemo(() => {
    // 연도 옵션 생성
    const startYear = 2025
    const options: string[] = []
    for (let y = startYear; y >= 1900; y--) {
      options.push(`${y}`)
    }
    return options
  }, [])

  const handleYearSelect = (year: string) => {
    // 연도 선택 처리 함수
    const parsed = parseInt(year)
    if (!isNaN(parsed)) {
      if (years.includes(parsed)) {
        showWarning('이미 추가된 연도입니다!') // 이미 추가된 연도 경고
      } else if (years.length >= 5) {
        showWarning('최대 5개의 연도만 추가할 수 있습니다!') // 최대 연도 초과 경고
      } else {
        setYears(prev => [...prev, parsed].sort((a, b) => a - b)) // 연도 추가
        showSuccess('연도가 추가되었습니다!') // 성공 메시지
      }
    }
  }

  const removeYearByValue = (year: number) => {
    // 연도 제거 함수
    setYears(prev => prev.filter(y => y !== year))
  }

  const onValueChange = (rowIndex: number, year: number, value: string) => {
    // 값 변경 처리 함수
    const updatedRows = [...rows] // 기존 행 데이터 복사
    if (!updatedRows[rowIndex].values) {
      updatedRows[rowIndex].values = {} // 값 객체가 없으면 새로 생성
    }
    updatedRows[rowIndex].values[year] = value // 연도별 값 업데이트
    setRows(updatedRows) // 상태 업데이트
  }

  return (
    <div className="w-auto overflow-auto bg-white rounded-xl shadow p-5">
      {/* 모달 헤더 */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h2 className="text-2xl font-apple">데이터 입력</h2>
      </div>
      {/* 지표 및 연도 선택 */}
      <div className="flex items-center gap-4 mb-4">
        <ComboboxWithCreate
          items={indicators.map(ind => ind.label)} // 지표 목록
          placeholder="항목 선택" // 플레이스홀더
          onAdd={async newLabel => {
            // 새 지표 추가
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
          items={yearOptions} // 연도 옵션
          placeholder="연도 선택" // 플레이스홀더
          onSelect={handleYearSelect} // 연도 선택 처리
          onAdd={handleYearSelect} // 새 연도 추가 처리
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
                      onClick={() => removeYearByValue(year)} // 연도 제거 버튼
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
              // 행 데이터가 없을 때
              <tr className="bg-[#F8FAFC] text-center text-sm text-gray-400 font-apple">
                <td className="py-4" colSpan={5 + years.length}>
                  지표를 추가하면 여기에 데이터가 추가됩니다.
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                // 행 데이터 렌더링
                <tr
                  key={rowIndex}
                  className="text-center text-sm text-gray-700 font-apple">
                  <td>
                    <button
                      onClick={() => onRemoveRow(rowIndex)} // 행 제거 버튼
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
                      value={row.field1 || ''} // 대분류 입력
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
                      value={row.field2 || ''} // 중분류 입력
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
                      selected={selectedUnits[row.indicatorKey] || ''} // 선택된 단위
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
                        // 새 단위 추가
                        const key = row.indicatorKey
                        setIndicators(prev =>
                          prev.map(ind =>
                            ind.key === key ? {...ind, unit: newUnit} : ind
                          )
                        )

                        setSelectedUnits(prev => ({...prev, [key]: newUnit}))
                      }}
                      onSelect={unit => {
                        // 단위 선택
                        const key = row.indicatorKey
                        setIndicators(prev =>
                          prev.map(ind => (ind.key === key ? {...ind, unit} : ind))
                        )
                        setSelectedUnits(prev => ({...prev, [key]: unit}))
                        setRows(prev =>
                          prev.map(row =>
                            row.indicatorKey === key ? {...row, unit} : row
                          )
                        )
                      }}
                    />
                  </td>
                  {years.map(year => (
                    <td key={year} className="px-2">
                      <input
                        type="text"
                        value={row.values[year] || ''} // 연도별 값 입력
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

      {/* 제출 버튼 */}
      <div className="flex justify-end mt-6">
        <div className="flex justify-end mt-6">
          <Button
            onClick={() => {
              if (rows.length === 0 || years.length === 0) {
                showWarning('데이터를 입력해주세요.') // 데이터 입력 경고
                return
              }

              const hasEmptyValue = rows.some(row =>
                years.some(year => !row.values[year] || row.values[year].trim() === '')
              )

              if (hasEmptyValue) {
                showWarning('모든 연도에 값을 입력해주세요.') // 빈 값 경고
                return
              }

              onSubmitPage?.() // 페이지 제출
            }}
            className="bg-gray-200 text-black text-lg px-8 py-2 rounded-full hover:bg-gray-300 font-apple">
            다음 &gt;
          </Button>
        </div>
      </div>
    </div>
  )
}
