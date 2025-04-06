'use client'

import {useEffect, useState} from 'react'
import {useESGModal} from './ESGModalContext'
import Modal from './Modal'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'
import {
  fetchIndicatorsWithPrevYearData,
  fetchGoalsByCategory,
  saveGoalsToServer,
  deleteGoal
} from '@/services/esg-goal'
import {toast} from 'react-hot-toast'
import {Button} from '@/components/ui/button'

interface GoalsModalProps {
  onGoalsSaved?: () => void
}

export default function GoalsModal({onGoalsSaved}: GoalsModalProps) {
  const {isGoalModalOpen, setIsGoalModalOpen} = useESGModal()

  const categoryOptions = ['Environmental', 'Social', 'Governance']
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const currentYear = new Date().getFullYear()
  const prevYear = currentYear - 1

  const [goalValues, setGoalValues] = useState<{
    [category: string]: {
      [label: string]: {
        value: string
        unit: string
        key?: string
        prevValue?: number
      }
    }
  }>({})

  useEffect(() => {
    const loadData = async () => {
      if (!selectedCategory) return
      const categoryKey = selectedCategory.toLowerCase()

      try {
        const [indicators, savedGoals] = await Promise.all([
          fetchIndicatorsWithPrevYearData(categoryKey, currentYear),
          fetchGoalsByCategory(categoryKey, currentYear)
        ])

        const formatted = indicators.reduce((acc, field) => {
          const saved = savedGoals.find(goal => goal.indicatorKey === field.key)
          acc[field.label] = {
            value: saved?.targetValue?.toString() || '',
            unit: field.unit || '',
            key: field.key || field.label,
            prevValue: field.prevValue || field.data?.[prevYear] || 0
          }
          return acc
        }, {} as Record<string, {value: string; unit: string; key?: string; prevValue?: number}>)

        setGoalValues(prev => ({
          ...prev,
          [selectedCategory]: formatted
        }))
      } catch (err) {
        toast.error('지표/목표값 불러오기 오류')
        console.error(err)
      }
    }

    loadData()
  }, [selectedCategory])

  const handleInputChange = (label: string, value: string) => {
    if (!selectedCategory) return
    setGoalValues(prev => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        [label]: {
          ...prev[selectedCategory][label],
          value
        }
      }
    }))
  }

  const handleRemoveScope = async (label: string) => {
    if (!selectedCategory) return
    const categoryKey = selectedCategory.toLowerCase()
    const indicatorKey = goalValues[selectedCategory]?.[label]?.key
    if (!indicatorKey) return

    try {
      await deleteGoal(indicatorKey, categoryKey, currentYear)
      toast.success(`'${label}' 삭제 완료`)
      const updated = {...goalValues[selectedCategory]}
      delete updated[label]
      setGoalValues(prev => ({
        ...prev,
        [selectedCategory]: updated
      }))
    } catch (err) {
      toast.error(`'${label}' 삭제 실패`)
    }
  }

  const handleSaveGoals = async () => {
    if (!selectedCategory || !goalValues[selectedCategory]) return

    const payload = {
      category: selectedCategory.toLowerCase(),
      goals: Object.entries(goalValues[selectedCategory])
        .filter(([_, {value}]) => value !== '')
        .map(([label, {value, unit, key}]) => ({
          indicatorKey: key,
          targetValue: Number(value),
          unit,
          year: currentYear
        }))
    }

    try {
      await saveGoalsToServer(payload)
      toast.success('목표 저장 완료')
      setIsGoalModalOpen(false)
      onGoalsSaved?.()
    } catch (err) {
      toast.error('목표 저장 실패')
      console.error(err)
    }
  }

  return (
    <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)}>
      <div className="flex w-full h-full font-apple">
        <div className="flex flex-col gap-y-3 w-full">
          <div className="text-2xl font-apple">목표 설정 ({currentYear}년)</div>
          <div className="w-full border-b-2 mb-2" />

          <ComboboxWithCreate
            items={categoryOptions}
            selected={selectedCategory || ''}
            onSelect={setSelectedCategory}
            placeholder="카테고리 선택"
            onAdd={function (newLabel: string): void {
              throw new Error('Function not implemented.')
            }}
          />

          {selectedCategory && goalValues[selectedCategory] && (
            <div className="mt-4 space-y-3">
              {Object.entries(goalValues[selectedCategory]).map(
                ([label, {value, unit, prevValue}]) => {
                  const target = Number(value)
                  const prev = Number(prevValue || 0)
                  const percent = prev ? ((target / prev) * 100).toFixed(1) : 'N/A'

                  return (
                    <div
                      key={label}
                      className="grid grid-cols-4 gap-4 items-center text-center">
                      <span className="truncate">{label}</span>
                      <div className="flex flex-row gap-2 items-center col-span-2">
                        <input
                          type="number"
                          className="w-full rounded-xl border-2 px-2 py-1"
                          placeholder="목표값"
                          value={value}
                          onChange={e => handleInputChange(label, e.target.value)}
                        />
                        <span>{unit}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {prev ? (
                          <>
                            <div>{prev.toLocaleString()}</div>
                            <div className="text-xs">{percent}%</div>
                          </>
                        ) : (
                          '작년 값 없음'
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveScope(label)}
                        className="text-white text-xl bg-red-500 rounded-2xl w-8 h-8 ml-1"
                        title="삭제">
                        ×
                      </button>
                    </div>
                  )
                }
              )}
              <Button
                className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-xl shadow-md"
                onClick={handleSaveGoals}>
                목표 저장하기
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
