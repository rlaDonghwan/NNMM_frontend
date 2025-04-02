'use client'

import {createContext, useContext, useState} from 'react'
import type {ESGModalContextType, Row, Indicator} from '@/interface/modal'

const ESGModalContext = createContext<ESGModalContextType | null>(null)

export const ESGModalProvider = ({children}: {children: React.ReactNode}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [rows, setRows] = useState<Row[]>([])
  const [years, setYears] = useState<number[]>([2022, 2023, 2024])
  const [indicators, setIndicators] = useState<Indicator[]>([])

  // ✅ 차트 저장 후 콜백 함수 상태
  const [onChartSaved, setOnChartSaved] = useState<((chart: any) => void) | null>(null)

  // ✅ 상태 초기화 함수
  const reset = () => {
    setStep(1)
    setRows([])
    setYears([2022, 2023, 2024])
    setOnChartSaved(null) // ✅ 콜백도 초기화
  }

  return (
    <ESGModalContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen: (open: boolean, callback?: (chart: any) => void) => {
          setIsModalOpen(open)

          if (open && callback) {
            setOnChartSaved(() => callback) // ✅ 열릴 때 콜백 등록
          }

          if (!open) {
            setOnChartSaved(null) // ✅ 닫힐 때 콜백 해제
          }
        },
        onChartSaved,
        step,
        setStep,
        rows,
        setRows,
        years,
        setYears,
        indicators,
        setIndicators,
        reset
      }}>
      {children}
    </ESGModalContext.Provider>
  )
}

export const useESGModal = () => {
  const context = useContext(ESGModalContext)
  if (!context) throw new Error('useESGModal must be used within ESGModalProvider')
  return context
}
