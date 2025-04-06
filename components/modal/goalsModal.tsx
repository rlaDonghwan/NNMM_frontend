'use client'

import {useEffect, useState} from 'react'
import {useESGModal} from './ESGModalContext'
import Modal from './Modal'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'
import {
  fetchIndicatorsFromDashboard,
  fetchGoalsByCategory,
  saveGoalsToServer,
  deleteGoal
} from '@/services/esg-goal'
import {toast} from 'react-hot-toast'
import {Button} from '@/components/ui/button'

interface GoalsModalProps {
  onGoalsSaved?: () => void // ✅ 저장 후 실행할 콜백 (TotalDashboard 등에서 전달)
}

export default function GoalsModal({onGoalsSaved}: GoalsModalProps) {
  const {isGoalModalOpen, setIsGoalModalOpen} = useESGModal()

  const categoryOptions = ['Environmental', 'Social', 'Governance']
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [goalValues, setGoalValues] = useState<{
    [category: string]: {
      [label: string]: {value: string; unit: string; key?: string}
    }
  }>({})

  // ✅ 카테고리 변경 시 지표 + 저장된 목표값 함께 불러오기
  useEffect(() => {
    const loadIndicatorsAndGoals = async () => {
      if (!selectedCategory) return
      try {
        const categoryKey = selectedCategory.toLowerCase()

        const [indicators, savedGoals] = await Promise.all([
          fetchIndicatorsFromDashboard(categoryKey),
          fetchGoalsByCategory(categoryKey)
        ])

        const formatted = indicators.reduce((acc, field) => {
          const saved = savedGoals.find(
            goal => goal.indicatorKey === field.key || goal.indicatorKey === field.label
          )
          acc[field.label] = {
            value: saved?.targetValue?.toString() || '',
            unit: field.unit || '',
            key: field.key || field.label
          }
          return acc
        }, {} as {[label: string]: {value: string; unit: string; key?: string}})

        setGoalValues(prev => ({
          ...prev,
          [selectedCategory]: formatted
        }))
      } catch (err) {
        console.error('지표/목표값 불러오기 실패:', err)
        toast.error('지표 불러오기 중 오류가 발생했습니다.')
      }
    }

    loadIndicatorsAndGoals()
  }, [selectedCategory])

  // ✅ 입력값 변경
  const handleInputChange = (label: string, value: string) => {
    if (!selectedCategory) return
    setGoalValues(prev => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        [label]: {
          ...prev[selectedCategory]?.[label],
          value
        }
      }
    }))
  }

  // ✅ 항목 제거 (서버 삭제 포함)
  const handleRemoveScope = async (label: string) => {
    if (!selectedCategory) return
    const categoryKey = selectedCategory.toLowerCase()
    const indicatorKey = goalValues[selectedCategory]?.[label]?.key

    if (!indicatorKey) return

    try {
      await deleteGoal(indicatorKey, categoryKey)
      toast.success(`'${label}' 항목이 삭제되었습니다.`)
    } catch (err) {
      console.error(err)
      toast.error(`'${label}' 삭제에 실패했습니다.`)
    }

    // ✅ 프론트에서도 제거
    const updated = {...goalValues[selectedCategory]}
    delete updated[label]
    setGoalValues(prev => ({
      ...prev,
      [selectedCategory]: updated
    }))
  }

  // ✅ 저장 로직
  const handleSaveGoals = async () => {
    if (!selectedCategory || !goalValues[selectedCategory]) return

    const payload = {
      category: selectedCategory.toLowerCase(),
      goals: Object.entries(goalValues[selectedCategory])
        .filter(([_, {value}]) => value !== '')
        .map(([label, {value, unit, key}]) => ({
          indicatorKey: key,
          targetValue: Number(value),
          unit
        }))
    }

    try {
      await saveGoalsToServer(payload)
      toast.success('✅ 목표 설정이 완료되었습니다!')
      setIsGoalModalOpen(false)

      // ✅ 저장 후 콜백 실행 (TotalDashboard 에서 loadGoalData 등)
      if (onGoalsSaved) {
        onGoalsSaved()
      }
    } catch (err) {
      console.error(err)
      toast.error('❌ 목표 설정에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)}>
      <div className="flex w-full h-full font-apple">
        <div className="flex flex-col gap-y-3 w-full">
          <div className="font-apple text-2xl">목표 설정</div>
          <div className="flex w-full h-2 border-b-2" />

          {/* ✅ 카테고리 선택 */}
          <ComboboxWithCreate
            items={categoryOptions}
            selected={selectedCategory || ''}
            onAdd={() => {}}
            onSelect={setSelectedCategory}
            placeholder="항목 선택"
          />

          {/* ✅ 지표별 목표 입력 폼 */}
          {selectedCategory && goalValues[selectedCategory] && (
            <div className="mt-4 space-y-3">
              <div className="text-lg font-semibold">{selectedCategory}</div>

              {Object.entries(goalValues[selectedCategory]).map(
                ([label, {value, unit}]) => (
                  <div
                    key={label}
                    className="grid grid-cols-4 w-full gap-4 items-center text-center">
                    <span>{label}</span>
                    <div className="flex flex-row gap-4 items-center col-span-2">
                      <input
                        type="number"
                        className="w-full rounded-xl border-2 px-2 py-1"
                        placeholder="목표 설정"
                        value={value}
                        onChange={e => handleInputChange(label, e.target.value)}
                      />
                      <span>{unit}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveScope(label)}
                      className="text-white text-xl bg-red-500 rounded-2xl w-12"
                      title="삭제">
                      -
                    </button>
                  </div>
                )
              )}

              {/* ✅ 저장 버튼 */}
              <Button
                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 rounded-xl shadow-md transition-all duration-200 font-apple"
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
