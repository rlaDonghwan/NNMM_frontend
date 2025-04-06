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
        currentValue: string
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
            currentValue: saved?.currentValue?.toString() || '',
            unit: field.unit || '',
            key: field.key || field.label,
            prevValue: field.prevValue || field.data?.[prevYear] || 0
          }
          return acc
        }, {} as (typeof goalValues)[string])

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

  const handleInputChange = (
    label: string,
    field: 'value' | 'currentValue',
    value: string
  ) => {
    if (!selectedCategory) return
    setGoalValues(prev => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        [label]: {
          ...prev[selectedCategory][label],
          [field]: value
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
        .map(([_, {value, currentValue, unit, key}]) => ({
          indicatorKey: key,
          targetValue: Number(value),
          currentValue: Number(currentValue),
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
      <div className="flex w-full h-full font-apple text-[15px]">
        <div className="flex flex-col gap-y-3 w-full">
          <div className="text-2xl font-semibold">목표 설정 ({currentYear}년)</div>
          <div className="w-full border-b-2 mb-2" />

          <ComboboxWithCreate
            items={categoryOptions}
            selected={selectedCategory || ''}
            onSelect={setSelectedCategory}
            placeholder="카테고리 선택"
            onAdd={() => {}}
          />

          {selectedCategory && goalValues[selectedCategory] && (
            <div className="mt-4 space-y-4">
              {Object.entries(goalValues[selectedCategory]).map(
                ([label, {value, currentValue, unit, prevValue}]) => {
                  const target = Number(value)
                  const current = Number(currentValue)
                  const prev = Number(prevValue || 0)

                  const usagePercent = target
                    ? ((current / target) * 100).toFixed(1)
                    : 'N/A'
                  const diffPercent = prev
                    ? ((target / prev) * 100 - 100).toFixed(1)
                    : 'N/A'
                  const arrow =
                    prev && target
                      ? target > prev
                        ? '↑'
                        : target < prev
                        ? '↓'
                        : '→'
                      : ''

                  return (
                    <div
                      key={label}
                      className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded-lg shadow-sm">
                      {/* 🏷 지표명 */}
                      <div className="md:col-span-3 font-semibold truncate text-sm text-left px-1">
                        {label}
                      </div>

                      {/* 🎯 목표값 입력 */}
                      <div className="md:col-span-3 flex flex-row gap-2 items-center">
                        <input
                          type="number"
                          className="w-full rounded-lg border px-3 py-1 text-sm shadow-inner"
                          placeholder="목표값"
                          value={value}
                          onChange={e =>
                            handleInputChange(label, 'value', e.target.value)
                          }
                        />
                        <span className="text-xs text-gray-600">{unit}</span>
                      </div>

                      {/* 📌 현재 사용량 입력 */}
                      <div className="md:col-span-2 flex flex-row gap-2 items-center">
                        <input
                          type="number"
                          className="w-full rounded-lg border px-3 py-1 text-sm shadow-inner"
                          placeholder="현재 사용량"
                          value={currentValue}
                          onChange={e =>
                            handleInputChange(label, 'currentValue', e.target.value)
                          }
                        />
                        <span className="text-xs text-gray-600">{unit}</span>
                      </div>

                      {/* 📊 비교 및 퍼센트 */}
                      <div className="md:col-span-3 text-xs text-center text-gray-600 leading-snug">
                        <div>
                          전년도: {prev ? `${prev.toLocaleString()} ${unit}` : 'N/A'}
                        </div>
                        <div>
                          {prev ? (
                            <span
                              className={
                                arrow === '↑'
                                  ? 'text-red-500'
                                  : arrow === '↓'
                                  ? 'text-blue-500'
                                  : 'text-gray-400'
                              }>
                              {arrow} {diffPercent}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                        <div>
                          진행률: {target && current ? `${usagePercent}%` : '미입력'}
                        </div>
                      </div>

                      {/* ❌ 삭제 */}
                      <div className="md:col-span-1 flex justify-center">
                        <button
                          onClick={() => handleRemoveScope(label)}
                          className="text-white text-xs bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 flex items-center justify-center"
                          title="삭제">
                          ×
                        </button>
                      </div>
                    </div>
                  )
                }
              )}

              <Button
                className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-xl shadow-md hover:bg-blue-700 transition-all"
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
