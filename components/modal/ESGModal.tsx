'use client'

import Modal from './Modal'
import ModalContent from './ModalContent'
import SecondModalContent from './SecondModalContent'
import {useESGModal} from './ESGModalContext'
import {fetchIndicators} from '@/services/indicator'
import {useEffect} from 'react'

export default function ESGModal({category}: {category: string}) {
  const {
    isModalOpen,
    setIsModalOpen,
    step,
    setStep,
    rows,
    setRows,
    years,
    setYears,
    indicators,
    setIndicators,
    reset
  } = useESGModal()

  useEffect(() => {
    const loadIndicators = async () => {
      try {
        const data = await fetchIndicators(category)
        setIndicators(data)
      } catch (error) {
        console.error('지표 불러오기 실패:', error)
      }
    }

    if (isModalOpen) {
      loadIndicators()
    }
  }, [isModalOpen, category])

  const getUnit = key => indicators.find(i => i.key === key)?.unit || ''

  const handleSubmit = async () => {
    try {
      const sanitized = rows.map(({color, ...rest}) => rest)
      setIsModalOpen(false)
      reset()
    } catch (err) {
      console.error('저장 오류:', err)
    }
  }

  const removeRow = index => {
    const updated = [...rows]
    updated.splice(index, 1)
    setRows(updated)
  }

  const handleValueChange = (rowIndex, year, value) => {
    const updated = [...rows]
    updated[rowIndex].values[year] = value
    setRows(updated)
  }

  const handleIndicatorChange = (rowIndex, key) => {
    const updated = [...rows]
    updated[rowIndex].indicatorKey = key
    setRows(updated)
  }

  const addRowWithIndicator = indicatorKey => {
    const newRow = {
      id: crypto.randomUUID(),
      indicatorKey,
      values: years.reduce((acc, y) => ({...acc, [y]: ''}), {}),
      color: '#cccccc'
    }
    setRows(prev => [...prev, newRow])
  }

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      {step === 1 && (
        <ModalContent
          years={years}
          setYears={setYears}
          rows={rows}
          setRows={setRows}
          indicators={indicators}
          setIndicators={setIndicators}
          onRemoveYear={() => setYears(prev => prev.slice(0, -1))}
          onRemoveRow={removeRow}
          onValueChange={handleValueChange}
          getUnit={getUnit}
          onSubmit={handleSubmit}
          onAddRowWithIndicator={addRowWithIndicator}
          onSubmitPage={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <SecondModalContent
          years={years}
          setYears={setYears}
          rows={rows}
          setRows={setRows}
          indicators={indicators}
          setIndicators={setIndicators}
          onAddYear={() => setYears([...years, Math.max(...years) + 1])}
          onRemoveYear={() => setYears(prev => prev.slice(0, -1))}
          onRemoveRow={removeRow}
          onValueChange={handleValueChange}
          getUnit={getUnit}
          onSubmit={handleSubmit}
          onAddRowWithIndicator={addRowWithIndicator}
          onIndicatorChange={handleIndicatorChange}
          onBack={() => setStep(1)}
          onSubmitPage={handleSubmit}
        />
      )}
    </Modal>
  )
}
