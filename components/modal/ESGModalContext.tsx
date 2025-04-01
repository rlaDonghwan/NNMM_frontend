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

  const reset = () => {
    setStep(1)
    setRows([])
    setYears([2022, 2023, 2024])
  }

  return (
    <ESGModalContext.Provider
      value={{
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
