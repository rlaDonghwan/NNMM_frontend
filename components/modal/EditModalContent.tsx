// 리액트 훅 및 필요한 컴포넌트/유틸 불러오기
import {useState, useEffect, useMemo} from 'react' // 상태 관리 및 메모화를 위한 React 훅
import {Button} from '@/components/ui/button' // 버튼 컴포넌트
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate' // 커스텀 콤보박스 컴포넌트
import {usePathname} from 'next/navigation' // 현재 경로를 가져오는 Next.js 훅
import {showWarning, showSuccess} from '@/utils/toast' // 알림 메시지 유틸 함수
import {ModalContentProps} from '@/interface/modal' // 타입 인터페이스 import
// -----------------------------------------------------------새로 추가 중
// ----------------------------------------------------------------ESG 데이터 수정 모달 컴포넌트
export default function EditModalContent({
  years, // 선택된 연도 배열
  setYears, // 연도 배열 업데이트 함수
  rows, // 데이터 행 배열
  setRows, // 데이터 행 배열 업데이트 함수
  indicators, // 지표 배열
  setIndicators, // 지표 배열 업데이트 함수
  onRemoveRow, // 행 삭제 함수
  onAddRowWithIndicator, // 지표를 추가하는 함수
  onSubmitPage // 다음 단계로 이동하는 함수
}: ModalContentProps) {
  const pathname = usePathname() // 현재 경로 가져오기
  // 현재 경로에 따라 카테고리 결정
  const category = pathname.includes('social') // 경로에 'social'이 포함되었는지 확인
    ? 'social' // 포함되었다면 'social' 카테고리
    : pathname.includes('environmental') // 'environmental'이 포함되었는지 확인
    ? 'environmental' // 포함되었다면 'environmental' 카테고리
    : 'governance' // 둘 다 포함되지 않았다면 'governance' 카테고리

  // ---------------------------------------------------------선택된 지표/회사명/연도/단위 상태
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]?.key || '') // 선택된 지표 상태
  const [companyName, setCompanyName] = useState('') // 회사명 상태
  const [selectedYear, setSelectedYear] = useState('') // 선택된 연도 상태
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({}) // 선택된 단위 상태

  // ------------------------------------------연도 선택 드롭다운을 위한 옵션 생성 (2025 ~ 1900)
  const yearOptions = useMemo(() => {
    const startYear = 2025 // 시작 연도
    const options: string[] = [] // 연도 옵션 배열
    for (let y = startYear; y >= 1900; y--) {
      // 2025년부터 1900년까지 반복
      options.push(`${y}`) // 연도를 문자열로 추가
    }
    return options // 생성된 연도 옵션 반환
  }, [])

  // ----------------------------------------------------------------연도 선택 시 처리 로직
  const handleYearSelect = (year: string) => {
    const parsed = parseInt(year) // 선택된 연도를 숫자로 변환
    if (!isNaN(parsed)) {
      // 변환된 값이 숫자인지 확인
      if (years.includes(parsed)) {
        // 이미 추가된 연도인지 확인
        showWarning('이미 추가된 연도입니다!') // 경고 메시지 표시
      } else if (years.length >= 5) {
        // 최대 5개의 연도만 추가 가능
        showWarning('최대 5개의 연도만 추가할 수 있습니다!') // 경고 메시지 표시
      } else {
        setYears(prev => [...prev, parsed].sort((a, b) => a - b)) // 연도 추가 및 정렬
        showSuccess('연도가 추가되었습니다!') // 성공 메시지 표시
      }
    }
  }
  // ------------------------------------------------------------------------특정 연도 삭제
  const removeYearByValue = (year: number) => {
    setYears(prev => prev.filter(y => y !== year)) // 선택된 연도를 제외한 배열로 업데이트
  }
  // ---------------------------------------------------------------데이터 입력값 변경 시 호출
  const onValueChange = (rowIndex: number, year: number, value: string) => {
    const updatedRows = [...rows] // 기존 행 배열 복사
    if (!updatedRows[rowIndex].values) {
      // 값이 없는 경우 초기화
      updatedRows[rowIndex].values = {}
    }
    updatedRows[rowIndex].values[year] = value // 특정 연도의 값 업데이트
    setRows(updatedRows) // 업데이트된 행 배열 설정
  }
  //-------------------------------------------------------------------------------HTML
  return (
    <div className="w-auto overflow-auto bg-white rounded-xl shadow p-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h2 className="text-2xl font-apple">데이터 수정</h2> {/* 제목 */}
      </div>
      {/* 지표 및 연도 선택 영역 */}
      <div className="flex items-center gap-4 mb-4">
        {/* 지표 선택 콤보박스 */}
        <ComboboxWithCreate
          items={indicators.map(ind => ind.label)} // 지표 라벨 배열
          placeholder="항목 선택" // 플레이스홀더 텍스트
          onAdd={async newLabel => {
            // 새 항목 추가 시 처리
            const indicator = indicators.find(ind => ind.label === newLabel) // 기존 지표 검색
            const keyToUse = indicator ? indicator.key : newLabel // 키 설정
            setSelectedIndicator(keyToUse) // 선택된 지표 업데이트
            onAddRowWithIndicator(keyToUse) // 지표 추가 함수 호출
          }}
          onSelect={label => {
            // 항목 선택 시 처리
            const ind = indicators.find(ind => ind.label === label) // 기존 지표 검색
            const keyToUse = ind ? ind.key : label // 키 설정
            setSelectedIndicator(keyToUse) // 선택된 지표 업데이트
            onAddRowWithIndicator(keyToUse) // 지표 추가 함수 호출
          }}
        />
        {/* 연도 선택 콤보박스 */}
        <ComboboxWithCreate
          items={yearOptions} // 연도 옵션 배열
          placeholder="연도 선택" // 플레이스홀더 텍스트
          onSelect={handleYearSelect} // 연도 선택 시 처리
          onAdd={handleYearSelect} // 새 연도 추가 시 처리
        />
      </div>
      {/* 데이터 입력 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-1">
          <thead className="text-center text-gray-600 text-sm border-b font-apple">
            <tr>
              <th></th> {/* 빈 열 */}
              <th>항목</th> {/* 항목 열 */}
              <th>대분류</th> {/* 대분류 열 */}
              <th>중분류</th> {/* 중분류 열 */}
              <th>단위</th> {/* 단위 열 */}
              {years.map(
                (
                  year // 연도별 열 생성
                ) => (
                  <th key={year} className="py-2">
                    {/* 연도별 삭제 버튼 */}
                    <div className="flex flex-col items-center relative">
                      <button
                        onClick={() => removeYearByValue(year)} // 연도 삭제 처리
                        className="w-5 h-5 bg-red-400 text-white rounded-full text-xs mb-1 font-apple">
                        -
                      </button>
                      <span>{year}</span> {/* 연도 표시 */}
                    </div>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? ( // 데이터 행이 없는 경우
              // 지표가 없는 경우 안내 메시지
              <tr className="bg-[#F8FAFC] text-center text-sm text-gray-400 font-apple">
                <td className="py-4" colSpan={5 + years.length}>
                  지표를 추가하면 여기에 데이터가 추가됩니다.
                </td>
              </tr>
            ) : (
              // 지표 행 반복 렌더링
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="text-center text-sm text-gray-700 font-apple">
                  <td>
                    {/* 해당 지표 행 삭제 버튼 */}
                    <button
                      onClick={() => onRemoveRow(rowIndex)} // 행 삭제 처리
                      className="w-6 h-6 bg-red-400 text-white rounded-full font-apple">
                      -
                    </button>
                  </td>
                  {/* 지표명 */}
                  <td className="px-2 text-left">
                    {indicators.find(i => i.key === row.indicatorKey)?.label ||
                      row.indicatorKey}
                  </td>
                  {/* 대분류 입력 */}
                  <td className="px-2">
                    <input
                      type="text"
                      value={row.field1 || ''} // 대분류 값
                      placeholder="ex: 항공부분" // 플레이스홀더 텍스트
                      onChange={e => {
                        // 값 변경 시 처리
                        const updated = [...rows]
                        updated[rowIndex].field1 = e.target.value
                        setRows(updated)
                      }}
                      className="w-full px-2 py-1 border rounded font-apple"
                    />
                  </td>
                  {/* 중분류 입력 */}
                  <td className="px-2">
                    <input
                      type="text"
                      value={row.field2 || ''} // 중분류 값
                      placeholder="ex: 국내선 (선택)" // 플레이스홀더 텍스트
                      onChange={e => {
                        // 값 변경 시 처리
                        const updated = [...rows]
                        updated[rowIndex].field2 = e.target.value
                        setRows(updated)
                      }}
                      className="w-full px-2 py-1 border rounded font-apple"
                    />
                  </td>
                  {/* 단위 선택 */}
                  <td className="px-2">
                    <ComboboxWithCreate
                      selected={selectedUnits[row.indicatorKey] || ''} // 선택된 단위
                      items={(() => {
                        // 단위 옵션 생성
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
                        // 새 단위 추가 시 처리
                        const key = row.indicatorKey
                        setIndicators(prev =>
                          prev.map(ind =>
                            ind.key === key ? {...ind, unit: newUnit} : ind
                          )
                        )
                        setSelectedUnits(prev => ({...prev, [key]: newUnit}))
                      }}
                      onSelect={unit => {
                        // 단위 선택 시 처리
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
                  {/* 연도별 값 입력 */}
                  {years.map(year => (
                    <td key={year} className="px-2">
                      <input
                        type="text"
                        value={row.values[year] || ''} // 연도별 값
                        onChange={e => onValueChange(rowIndex, year, e.target.value)} // 값 변경 시 처리
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

      {/* 다음 버튼 */}
      <div className="flex justify-end mt-6">
        <Button
          onClick={() => {
            // 버튼 클릭 시 처리
            if (rows.length === 0 || years.length === 0) {
              // 데이터가 없는 경우
              showWarning('데이터를 입력해주세요.') // 경고 메시지 표시
              return
            }

            const hasEmptyValue = rows.some(
              (
                row // 빈 값이 있는지 확인
              ) => years.some(year => !row.values[year] || row.values[year].trim() === '')
            )

            if (hasEmptyValue) {
              // 빈 값이 있는 경우
              showWarning('모든 연도에 값을 입력해주세요.') // 경고 메시지 표시
              return
            }

            onSubmitPage?.() // 다음 단계로 이동
          }}
          className="bg-gray-200 text-black text-lg px-8 py-2 rounded-full hover:bg-gray-300 font-apple">
          수정 ✔ {/* 버튼 텍스트 */}
        </Button>
      </div>
    </div>
  )
}
