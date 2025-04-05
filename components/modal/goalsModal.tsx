'use client'

import {useEffect, useState} from 'react'
import {useESGModal} from './ESGModalContext'
import Modal from './Modal'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'
import {fetchIndicatorsFromDashboard} from '@/services/esg-goal' // ✅ esg-dashboard 기반 API

export default function GoalsModal() {
  const {isGoalModalOpen, setIsGoalModalOpen} = useESGModal()

  const categoryOptions = ['Environmental', 'Social', 'Governance']
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [goalValues, setGoalValues] = useState<{
    [category: string]: {
      [label: string]: {value: string; unit: string}
    }
  }>({})

  // ✅ 카테고리 변경 시 esg-dashboard에서 지표 불러오기
  useEffect(() => {
    const loadIndicators = async () => {
      if (!selectedCategory) return
      try {
        const indicators = await fetchIndicatorsFromDashboard(
          selectedCategory.toLowerCase()
        )

        const formatted = indicators.reduce((acc, field) => {
          acc[field.label] = {
            value: '',
            unit: field.unit || ''
          }
          return acc
        }, {} as {[label: string]: {value: string; unit: string}})

        setGoalValues(prev => ({
          ...prev,
          [selectedCategory]: formatted
        }))
      } catch (err) {
        console.error('지표 불러오기 실패:', err)
      }
    }

    loadIndicators()
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

  // ✅ 항목 제거
  const handleRemoveScope = (label: string) => {
    if (!selectedCategory) return
    const updated = {...goalValues[selectedCategory]}
    delete updated[label]
    setGoalValues(prev => ({
      ...prev,
      [selectedCategory]: updated
    }))
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
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
