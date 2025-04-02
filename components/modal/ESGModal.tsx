'use client'

import {useEffect, useState} from 'react'
import Modal from './Modal'
import ModalContent from './ModalContent'
import SecondModalContent from './SecondModalContent'
import {useESGModal} from './ESGModalContext'
import {fetchIndicators} from '@/services/indicator'
import {saveChartConfig} from '@/services/chart-config'
import {ESGModalProps, Row, Indicator} from '@/interface/modal'

// ESGModal 컴포넌트: 카테고리별 ESG 입력 및 차트 설정 모달을 렌더링
export default function ESGModal({category}: ESGModalProps) {
  const {
    isModalOpen, // 모달 열림 여부
    setIsModalOpen, // 모달 열고 닫는 함수 (콜백도 등록 가능)
    step, // 현재 모달 단계 (1 또는 2)
    setStep, // 단계 변경 함수
    rows,
    setRows, // 지표 데이터 행 상태
    years,
    setYears, // 선택된 연도들
    indicators,
    setIndicators, // 지표 메타데이터
    onChartSaved, // 차트 저장 후 콜백 (부모로부터 전달)
    reset // 모달 내부 상태 초기화 함수
  } = useESGModal()

  const [chartType, setChartType] = useState<string>() // 선택된 차트 타입
  const [selectedRows, setSelectedRows] = useState<number[]>([]) // 선택된 row 인덱스
  const [title, setTitle] = useState<string>('') // 차트 제목
  const [colorSet, setColorSet] = useState<string[]>([]) // 색상 배열
  const [charts, setCharts] = useState<any[]>([]) // 추가된 차트들 (내부 용도)

  // 페이지 진입 시 지표 데이터를 불러옴
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

  // 지표 key에 해당하는 단위 문자열 반환
  const getUnit = (key: string): string => indicators.find(i => i.key === key)?.unit || ''

  // 전체 차트 저장 처리 함수
  const handleSubmit = async () => {
    try {
      const res = await saveChartConfig({
        chartType, // 선택된 차트 타입
        selectedRows, // 선택된 행 인덱스
        rows, // 전체 입력 행
        indicators, // 지표 메타데이터
        colorSet, // 색상들
        years, // 연도들
        title, // 차트 제목
        category // 카테고리 (social/environmental/governance)
      })

      // 저장 완료 시 콜백 실행 → 부모 컴포넌트에 전달
      if (onChartSaved) onChartSaved(res.data)

      // 내부적으로도 차트 상태 업데이트 (선택사항)
      setCharts(prev => [...prev, res.data])

      // 상태 초기화 및 모달 닫기
      reset()
      setTimeout(() => {
        setIsModalOpen(false)
      }, 300)
    } catch (err) {
      console.error('저장 오류:', err)
    }
  }

  // 행 삭제
  const removeRow = (index: number) => {
    const updated = [...rows]
    updated.splice(index, 1)
    setRows(updated)
  }

  // 셀 값 변경
  const handleValueChange = (rowIndex: number, year: number, value: string) => {
    const updated = [...rows]
    updated[rowIndex].values[year] = value
    setRows(updated)
  }

  // 지표 변경 시
  const handleIndicatorChange = (rowIndex: number, key: string) => {
    const updated = [...rows]
    updated[rowIndex].indicatorKey = key
    setRows(updated)
  }

  // 지표를 기반으로 새 행 추가
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
      {/* Step 1: 지표/값 입력 화면 */}
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
          onSubmitPage={() => setStep(2)} // 다음 단계 이동
        />
      )}

      {/* Step 2: 차트 설정 및 저장 */}
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
          onBack={() => setStep(1)} // 이전 단계 이동
          onSubmitPage={handleSubmit}
          chartType={chartType}
          setChartType={setChartType}
          title={title}
          setTitle={setTitle}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          colorSet={colorSet}
          setColorSet={setColorSet}
          // 차트 저장 시 상위 콜백 전달
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
