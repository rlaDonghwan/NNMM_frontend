'use client'

import {createContext, useContext, useState} from 'react'
import type {ESGModalContextType, Row, Indicator} from '@/interface/modal'

// ESG 모달을 위한 Context 생성
const ESGModalContext = createContext<ESGModalContextType | null>(null)

// Provider 컴포넌트 정의 (전역 상태를 자식 컴포넌트에 전달)
export const ESGModalProvider = ({children}: {children: React.ReactNode}) => {
  // 모달 오픈 여부
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  // 현재 모달 단계 (1: 데이터 입력, 2: 차트 설정)
  const [step, setStep] = useState(1)
  // 입력된 지표 데이터 row 배열
  const [rows, setRows] = useState<Row[]>([])
  // 선택된 연도 리스트
  const [years, setYears] = useState<number[]>([2022, 2023, 2024])
  // 현재 카테고리에 해당하는 지표 리스트
  const [indicators, setIndicators] = useState<Indicator[]>([])

  // 차트 저장 후 실행할 콜백 함수
  const [onChartSaved, setOnChartSaved] = useState<((chart: any) => void) | null>(null)

  // ⭐ 수정할 차트 데이터를 저장할 상태
  const [chartToEdit, setChartToEdit] = useState<any | null>(null)

  // 모달 상태 및 값 초기화 함수
  const reset = () => {
    setStep(1) // 1단계로 리셋
    setRows([]) // 입력 지표 초기화
    setYears([2022, 2023, 2024]) // 기본 연도 초기화
    setOnChartSaved(null) // 콜백도 초기화
    setChartToEdit(null) // ⭐ 수정 대상도 초기화
  }

  return (
    <ESGModalContext.Provider
      value={{
        isModalOpen, // 모달 오픈 여부
        // 모달 오픈 함수 (필요 시 콜백도 함께 등록)
        setIsModalOpen: (open: boolean, callback?: (chart: any) => void) => {
          setIsModalOpen(open)
          if (open && callback) {
            // 모달 열릴 때 콜백 등록
            setOnChartSaved(() => callback)
          }

          if (!open) {
            // 모달 닫힐 때 콜백 해제
            setOnChartSaved(null)
          }
        },
        setIsEditModalOpen: (open: boolean, callback?: (chart: any) => void) => {
          setIsModalOpen(open)
          if (open && callback) {
            // 모달 열릴 때 콜백 등록
            setOnChartSaved(() => callback)
          }

          if (!open) {
            // 모달 닫힐 때 콜백 해제
            setOnChartSaved(null)
          }
        },
        onChartSaved, // 현재 등록된 콜백 함수
        step, // 현재 모달 단계
        setStep, // 단계 설정 함수
        rows, // 지표 행 리스트
        setRows, // 지표 행 설정 함수
        years, // 선택된 연도 리스트
        setYears, // 연도 설정 함수
        indicators, // 지표 리스트
        setIndicators, // 지표 설정 함수
        chartToEdit, // ⭐ 현재 수정 대상 차트
        setChartToEdit, // ⭐ 수정 대상 차트 설정 함수
        reset // 전체 리셋 함수
      }}>
      {children}
    </ESGModalContext.Provider>
  )
}

// 커스텀 훅으로 context 사용
export const useESGModal = () => {
  const context = useContext(ESGModalContext)
  if (!context) throw new Error('useESGModal must be used within ESGModalProvider')
  return context
}
export const useEditESGModal = () => {
  const context = useContext(ESGModalContext)
  if (!context) throw new Error('useESGModal must be used within ESGModalProvider')
  return context
}
