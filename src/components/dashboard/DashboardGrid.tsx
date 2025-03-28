import {useEffect, useState} from 'react'
import Modal from '../modal/Modal'
import ModalContent from '../modal/ModalContent'

export default function DashboardGrid() {
  //지표 comboboxwithcreate부분 열려있는지 닫혀있는지 상태
  const [isModalOpen, setIsModalOpen] = useState(false)

  //지표 데이터를 배열로 상태 관리
  const [indicators, setIndicators] = useState([
    {key: 'scope1', label: 'Scope1', unit: 'tCO₂-eq'},
    {key: 'scope2', label: 'Scope2', unit: 'tCO₂-eq'},
    {key: 'energyUse.electricity', label: '전기 사용량', unit: 'TJ'}
  ])
  //현재 사용중인 연도
  const [years, setYears] = useState([2021, 2022, 2023])
  //각 지표별 입력 데이터
  const [rows, setRows] = useState([])

  const handleYearChange = (index: number, value: string) => {
    const updatedYears = [...years]
    updatedYears[index] = Number(value)
    setYears(updatedYears)
  }
  //가장 최근 연도 +1 값을 추가하고, 각 row에도 빈 칸을 추가함
  const addYear = () => {
    const newYear = Math.max(...years) + 1
    setYears([...years, newYear])
    setRows(
      rows.map(row => ({
        ...row,
        values: {...row.values, [newYear]: ''}
      }))
    )
  }
  //가장 큰 연도(최근 연도)를 제거하고 각 row에서도 삭제
  const removeYear = () => {
    if (years.length === 0) return

    const latestYear = Math.max(...years)
    const updatedYears = years.filter(year => year !== latestYear)

    setYears(updatedYears)
    setRows(
      rows.map(row => {
        const updatedValues = {...row.values}
        delete updatedValues[latestYear]
        return {
          ...row,
          values: updatedValues
        }
      })
    )
  }
  //특정 연도, 특정 row의 입력값을 수정
  const handleValueChange = (rowIndex: number, year: number, value: string) => {
    const updated = [...rows]
    updated[rowIndex].values[year] = value
    setRows(updated)
  }

  const handleIndicatorChange = (rowIndex: number, key: string) => {
    const updated = [...rows]
    updated[rowIndex].indicatorKey = key
    setRows(updated)
  }

  const handleColorChange = (rowIndex: number, color: string) => {
    const updated = [...rows]
    updated[rowIndex].color = color
    setRows(updated)
  }
  //새 row추가, 기본값으론 첫 번째 indicator
  const addRow = () => {
    const newRow = {
      id: crypto.randomUUID(),
      indicatorKey: indicators[0].key,
      values: years.reduce((acc, y) => ({...acc, [y]: ''}), {}),
      color: '#cccccc'
    }
    setRows([...rows, newRow])
  }
  //특정 row를 index기준으로 삭제
  const removeRow = (rowIndex: number) => {
    const updated = [...rows]
    updated.splice(rowIndex, 1)
    setRows(updated)
  }

  const handleSubmit = () => {
    console.log('제출된 데이터:', {years, rows})
    setIsModalOpen(false)
  }

  const getUnit = (key: string) => {
    return indicators.find(i => i.key === key)?.unit || ''
  }

  return (
    <div className="grid grid-cols-[400px,400px,400px] grid-rows-[300px,300px] gap-4">
      <div className="bg-blue-100 p-6 rounded-xl shadow">첫 번째 칸</div>
      <div className="bg-green-100 p-6 rounded-xl shadow">두 번째 칸</div>
      <div className="bg-yellow-100 p-6 rounded-xl shadow">세 번째 칸</div>
      <div className="bg-red-100 p-6 rounded-xl shadow">네 번째 칸</div>
      <div className="bg-purple-100 p-6 rounded-xl shadow">다섯 번째 칸</div>
      <div className="bg-pink-100 p-6 rounded-xl shadow">여섯 번째 칸</div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600 transition">
        데이터 입력
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent
          years={years}
          rows={rows}
          setRows={setRows}
          indicators={indicators}
          setIndicators={setIndicators}
          onAddYear={addYear}
          onRemoveYear={removeYear}
          onRemoveRow={removeRow}
          onValueChange={handleValueChange}
          onIndicatorChange={handleIndicatorChange}
          onColorChange={handleColorChange}
          getUnit={getUnit}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  )
}
