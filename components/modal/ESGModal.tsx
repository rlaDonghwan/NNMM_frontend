'use client'

// 모달 구성 관련 컴포넌트 및 훅 import
import Modal from './Modal'
import ModalContent from './ModalContent'
import SecondModalContent from './SecondModalContent'
import {useESGModal} from './ESGModalContext'
import {fetchIndicators} from '@/services/indicator'
import {saveChartConfig} from '@/services/chart-config' // 차트 저장 함수 import
import {useEffect, useState} from 'react'
import {ESGModalProps, Row, Indicator} from '@/interface/modal' // 타입 인터페이스 import

export default function ESGModal({category}: ESGModalProps) {
  // ESG 모달 관련 상태 및 메서드 불러오기
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

  const [chartType, setChartType] = useState<string>('bar')
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [title, setTitle] = useState<string>('사용자 차트')
  const [colorSet, setColorSet] = useState<string[]>([])

  // 모달이 열릴 때 해당 카테고리의 인디케이터 불러오기
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

  // 인디케이터의 단위 가져오기 함수
  const getUnit = (key: string): string => indicators.find(i => i.key === key)?.unit || ''

  // 차트 데이터 저장 함수
  const handleSubmit = async () => {
    try {
      await saveChartConfig({
        chartType,
        selectedRows,
        rows,
        indicators,
        colorSet,
        years,
        title,
        category
      })
      setIsModalOpen(false)
      reset()
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
        />
      )}
    </Modal>
  )
}
