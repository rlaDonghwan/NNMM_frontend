'use client'

import {useEffect, useState} from 'react'
import Modal from './Modal'
import ModalContent from './UnifiedModalContent'
import SecondModalContent from './SecondModalContent'
import {useESGModal} from './ESGModalContext'
import {fetchIndicators} from '@/services/indicator'
import {saveChartConfig} from '@/services/chart-config'
import {ESGModalProps, Row, Indicator} from '@/interface/modal'

export default function UnifiedESGModal({category}: ESGModalProps) {
  const {
    isModalOpen,
    setIsModalOpen,
    isEditModalOpen,
    step,
    setStep,
    rows,
    setRows,
    years,
    setYears,
    indicators,
    setIndicators,
    onChartSaved,
    chartToEdit,
    reset
  } = useESGModal()

  const [chartType, setChartType] = useState<string>()
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [title, setTitle] = useState<string>('')
  const [colorSet, setColorSet] = useState<string[]>([])
  const [charts, setCharts] = useState<any[]>([])

  // ✅ 1. 카테고리 변경 시 지표 불러오기
  useEffect(() => {
    const loadIndicators = async () => {
      try {
        const data = await fetchIndicators(category)
        console.log('지표 불러오기 성공:', data)
        setIndicators(data)
      } catch (error) {
        console.error('지표 불러오기 실패:', error)
      }
    }
    loadIndicators()
  }, [category])

  // ✅ 2. 수정 모드일 때 chartToEdit 상태 반영
  useEffect(() => {
    if (chartToEdit) {
      setChartType(chartToEdit.chartType)
      setTitle(chartToEdit.title)

      const years = chartToEdit.years || []
      setYears(years)

      const rows = chartToEdit.fields.map(field => ({
        id: field._id || crypto.randomUUID(),
        indicatorKey: field.key,
        field1: field.field1 || '',
        field2: field.field2 || '',
        values: Object.fromEntries(
          years.map(year => [
            year,
            field.data[year] !== undefined ? String(field.data[year]) : ''
          ])
        ),
        color: field.color || '#cccccc',
        unit: field.unit || chartToEdit.unit || ''
      }))

      setRows(rows)
      setColorSet(chartToEdit.fields.map(field => field.color || '#cccccc'))
    }
  }, [chartToEdit])

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
      if (onChartSaved) onChartSaved(res.data)
      setCharts(prev => [...prev, res.data])
      reset()
      setTimeout(() => setIsModalOpen(false), 300)
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
            if (onChartSaved) {
              onChartSaved(newChart)
            }
          }}
        />
      )}
    </Modal>
  )
}
