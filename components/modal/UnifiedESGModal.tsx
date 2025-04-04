'use client'

import {useEffect, useState} from 'react'
import Modal from './Modal'
import ModalContent from './UnifiedModalContent' // 1단계: 지표 입력
import SecondModalContent from './SecondModalContent' // 2단계: 차트 설정
import {useESGModal} from './ESGModalContext'
import {fetchIndicators} from '@/services/indicator'
import {saveChartConfig} from '@/services/chart-config'
import {ESGModalProps, Row, Indicator} from '@/interface/modal'

//  ESG 입력/수정 통합 모달 컴포넌트
export default function UnifiedESGModal({category}: ESGModalProps) {
  //  ESGModalContext에서 전역 상태 가져오기
  const {
    isModalOpen, // 모달 열림 여부
    setIsModalOpen, // 모달 열기/닫기
    isEditModalOpen, // 수정 모드 여부
    step, // 현재 모달 단계
    setStep, // 모달 단계 설정
    rows,
    setRows, // 입력된 지표 행들
    years,
    setYears, // 선택된 연도들
    indicators,
    setIndicators, // 전체 지표 리스트
    onChartSaved, // 저장 후 콜백
    chartToEdit, // 수정 대상 차트
    reset // 상태 초기화 함수
  } = useESGModal()
  //----------------------------------------------------------------------------------------------------

  //로컬 상태 관리
  const [chartType, setChartType] = useState<string>() // 차트 종류 (bar, pie 등)
  const [selectedRows, setSelectedRows] = useState<number[]>([]) // 선택된 지표 row 인덱스
  const [title, setTitle] = useState<string>('') // 차트 제목
  const [colorSet, setColorSet] = useState<string[]>([]) // 색상 배열
  const [charts, setCharts] = useState<any[]>([]) // 저장된 차트 리스트 (선택적)
  //----------------------------------------------------------------------------------------------------

  // 1. 카테고리 변경 시 지표 목록 불러오기
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

  //----------------------------------------------------------------------------------------------------

  // 2. 수정 모드일 경우 기존 차트 데이터 반영
  useEffect(() => {
    if (chartToEdit) {
      setChartType(chartToEdit.chartType)
      setTitle(chartToEdit.title)

      const years = chartToEdit.years || []
      setYears(years)

      // 필드 → rows 변환
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

  //----------------------------------------------------------------------------------------------------

  // 지표 키로 단위 반환
  const getUnit = (key: string): string => indicators.find(i => i.key === key)?.unit || ''
  // ----------------------------------------------------------------------------------------------------

  // 최종 제출 핸들러 (저장 API 호출)
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

      // 콜백 실행 (대시보드 갱신용)
      if (onChartSaved) onChartSaved(res.data)

      setCharts(prev => [...prev, res.data]) // 로컬 상태에도 추가 (선택적)
      reset() // 컨텍스트 초기화

      // 약간의 delay 후 모달 닫기
      setTimeout(() => setIsModalOpen(false), 300)
    } catch (err) {
      console.error('저장 오류:', err)
    }
  }
  //----------------------------------------------------------------------------------------------------

  // 특정 Row 삭제
  const removeRow = (index: number) => {
    const updated = [...rows]
    updated.splice(index, 1)
    setRows(updated)
  }
  //----------------------------------------------------------------------------------------------------

  // 특정 연도 값 변경
  const handleValueChange = (rowIndex: number, year: number, value: string) => {
    const updated = [...rows]
    updated[rowIndex].values[year] = value
    setRows(updated)
  }
  //----------------------------------------------------------------------------------------------------

  // 지표 변경 시 indicatorKey 갱신
  const handleIndicatorChange = (rowIndex: number, key: string) => {
    const updated = [...rows]
    updated[rowIndex].indicatorKey = key
    setRows(updated)
  }
  //----------------------------------------------------------------------------------------------------

  // 지표 키로 Row 추가
  const addRowWithIndicator = (indicatorKey: string) => {
    const newRow: Row = {
      id: crypto.randomUUID(),
      indicatorKey,
      values: years.reduce((acc, y) => ({...acc, [y]: ''}), {}),
      color: '#cccccc'
    }
    setRows(prev => [...prev, newRow])
  }
  //----------------------------------------------------------------------------------------------------

  // 렌더링 (2단계 모달 방식)
  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      {/* 1단계: ESG 지표 및 값 입력 */}
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

      {/* 2단계: 차트 설정 */}
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
          closeModal={() => setIsModalOpen(false)}
          onChartSaved={newChart => {
            if (onChartSaved) onChartSaved(newChart)
          }}
          onSubmit={handleSubmit}
        />
      )}
    </Modal>
  )
}
