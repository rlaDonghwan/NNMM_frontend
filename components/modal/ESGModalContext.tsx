'use client'

import {createContext, useContext, useState} from 'react'
import type {ESGModalContextType, Row, Indicator} from '@/interface/modal'

const ESGModalContext = createContext<ESGModalContextType | null>(null)

export const ESGModalProvider = ({children}: {children: React.ReactNode}) => {
  const [isModalOpen, setIsModalOpenState] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isGoalModalOpen, setIsGoalModalOpenSate] = useState(false)
  const [step, setStep] = useState(1)
  const [rows, setRows] = useState<Row[]>([])
  const [years, setYears] = useState<number[]>([2022, 2023, 2024])
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [onChartSaved, setOnChartSaved] = useState<((chart: any) => void) | null>(null)
  const [chartToEdit, setChartToEdit] = useState<any | null>(null)
  const setIsModalOpenWithCallback = (open: boolean, callback: (chart: any) => void) => {
    setIsModalOpen(open)
    setOnChartSaved(() => callback) // 예: 콜백 저장용 state
  }
  //----------------------------------------------------------------------------------------------------

  // 신규 또는 수정모드로 모달 열기 명확하게 처리
  const setIsModalOpen = (open: boolean, callback?: (chart: any) => void) => {
    setIsModalOpenState(open)
    if (open && callback) setOnChartSaved(() => callback)
    if (!open) {
      setOnChartSaved(null)
      setChartToEdit(null)
      setIsEditModalOpen(false) // 명확히 닫을 때 수정모드 비활성화
    }
  }
  //----------------------------------------------------------------------------------------------------

  // 상태 초기화
  const reset = () => {
    setStep(1)
    setRows([])
    setYears([2022, 2023, 2024])
    setOnChartSaved(null)
    setChartToEdit(null)
    setIsEditModalOpen(false)
  }
  //----------------------------------------------------------------------------------------------------

  // 수정모드로 바로 여는 헬퍼 함수 추가
  const openEditModal = (chart: any, callback?: (chart: any) => void) => {
    setChartToEdit(chart)
    setIsEditModalOpen(true)
    setIsModalOpen(true, callback)
  }
  //----------------------------------------------------------------------------------------------------
  const setIsGoalModalOpen = (open: boolean, callback?: (chart: any) => void) => {
    setIsGoalModalOpenSate(open)
  }

  return (
    <ESGModalContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        isGoalModalOpen,
        setIsGoalModalOpen,
        onChartSaved,
        step,
        setStep,
        rows,
        setRows,
        years,
        setYears,
        indicators,
        setIndicators,
        chartToEdit,
        setChartToEdit,
        reset,
        openEditModal,
        setIsModalOpenWithCallback
      }}>
      {children}
    </ESGModalContext.Provider>
  )
}
//----------------------------------------------------------------------------------------------------
// ESGModalContext를 사용하는 커스텀 훅
export const useESGModal = () => {
  const context = useContext(ESGModalContext)
  if (!context) throw new Error('useESGModal must be used within ESGModalProvider')
  return context
}
//----------------------------------------------------------------------------------------------------
