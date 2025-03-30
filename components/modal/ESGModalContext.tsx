'use client'

import {createContext, useContext, useState} from 'react'

const ESGModalContext = createContext(null)

export const ESGModalProvider = ({children}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [rows, setRows] = useState([])
  const [years, setYears] = useState([2022, 2023, 2024])
  const [indicators, setIndicators] = useState([])

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

export const useESGModal = () => useContext(ESGModalContext)
