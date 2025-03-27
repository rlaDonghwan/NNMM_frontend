import {useEffect, useState} from 'react'
import Modal from '../modal/Modal'
import ModalContent from '../modal/ModalContent'

export default function DashboardGrid() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const indicators = [
    {key: 'scope1', label: 'Scope 1', unit: 'tCO₂-eq'},
    {key: 'scope2', label: 'Scope 2', unit: 'tCO₂-eq'},
    {key: 'energyUse.electricity', label: '전기 사용량', unit: 'TJ'}
  ]
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0].key)

  const [years, setYears] = useState([2021, 2022, 2023])
  const [rows, setRows] = useState([])

  const addRowWithIndicator = () => {
    const newRow = {
      indicatorKey: selectedIndicator,
      values: years.reduce((acc, y) => ({...acc, [y]: ''}), {}),
      color: '#cccccc'
    }

    setRows([...rows, newRow])
  }
  const handleYearChange = (index: number, value: string) => {
    const updatedYears = [...years]
    updatedYears[index] = Number(value)
    setYears(updatedYears)
  }

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

  const addRow = () => {
    const newRow = {
      indicatorKey: indicators[0].key,
      values: years.reduce((acc, y) => ({...acc, [y]: ''}), {}),
      color: '#cccccc'
    }
    setRows([...rows, newRow])
  }

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
    <div className="mt-10 grid grid-cols-13 gap-4">
      <div className="col-span-4 bg-blue-100 p-6 rounded-xl shadow">📊 E 환경</div>
      <div className="col-span-4 bg-green-100 p-6 rounded-xl shadow">🤝 S 사회</div>
      <div className="col-span-5 bg-yellow-100 p-6 rounded-xl shadow">🏢 G 지배구조</div>

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
          onAddYear={addYear}
          onRemoveYear={removeYear}
          onAddRow={addRow}
          onRemoveRow={removeRow}
          onValueChange={handleValueChange}
          onIndicatorChange={handleIndicatorChange}
          onColorChange={handleColorChange}
          getUnit={getUnit}
          onSubmit={handleSubmit}
          onAddRowWithIndicator={addRowWithIndicator}
        />
      </Modal>
    </div>
  )
}
