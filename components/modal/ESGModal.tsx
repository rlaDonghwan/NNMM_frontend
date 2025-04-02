'use client'

import {useEffect, useState} from 'react'
import Modal from './Modal'
import ModalContent from './ModalContent'
import SecondModalContent from './SecondModalContent'
import {useESGModal} from './ESGModalContext'
import {fetchIndicators} from '@/services/indicator'
import {saveChartConfig} from '@/services/chart-config'
import {ESGModalProps, Row, Indicator} from '@/interface/modal'

export default function ESGModal({category}: ESGModalProps) {
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
    onChartSaved, // ✅ 부모에서 전달되는 콜백
    reset
  } = useESGModal()

  const [chartType, setChartType] = useState<string>()
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [title, setTitle] = useState<string>('')
  const [colorSet, setColorSet] = useState<string[]>([])
  const [charts, setCharts] = useState<any[]>([]) // ✅ 새로 추가된 chart들을 관리

  useEffect(() => {
    const loadIndicators = async () => {
      try {
        const data = await fetchIndicators(category)
        setIndicators(data)
      } catch (error) {
        console.error('지표 불러오기 실패:', error)
      }
    }

    loadIndicators()
  }, [category])

  const getUnit = (key: string): string => indicators.find(i => i.key === key)?.unit || ''

  const handleSubmit = async () => {
    try {
      const res = await saveChartConfig({
        chartType,
        selectedRows,
        rows,
        indicators,
        colorSet,
        years,
        title,
        category
      })

      // 콜백 실행 (환경 페이지에서 새 차트 추가)
      if (onChartSaved) onChartSaved(res.data)
      setCharts(prev => [...prev, res.data]) // ✅ 내부에서도 반영

      reset()
      setTimeout(() => {
        setIsModalOpen(false)
      }, 300) // 자연스럽게 닫히도록 딜레이
    } catch (err) {
      console.error('저장 오류:', err)
    }
  }

  const removeRow = (index: number) => {
    const updated = [...rows]
    updated.splice(index, 1)
    setRows(updated)
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

  const addRowWithIndicator = (indicatorKey: string) => {
    const newRow: Row = {
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
          chartType={chartType}
          setChartType={setChartType}
          title={title}
          setTitle={setTitle}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          colorSet={colorSet}
          setColorSet={setColorSet}
          onChartSaved={newChart => {
            // 👉 실제 부모에서 받은 콜백을 실행!
            if (onChartSaved) {
              onChartSaved(newChart)
            }
          }}
        />
      )}
    </Modal>
  )
}
