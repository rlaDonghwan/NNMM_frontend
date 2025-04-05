import {useESGModal} from './ESGModalContext'
import Modal from './Modal'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'
import {useState} from 'react'

export default function GoalsModal() {
  const {isGoalModalOpen, setIsGoalModalOpen} = useESGModal()

  const categoryOptions = ['Environmental', 'Social', 'Governance']
  const esgData = [
    {label: 'Scope1', unit: 'kg'},
    {label: 'Scope2', unit: 'km'},
    {label: 'Scope3', unit: 'g'}
  ]

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [goalValues, setGoalValues] = useState<{
    [category: string]: {[scopeLabel: string]: string}
  }>({})

  // 입력값 저장
  const handleInputChange = (category: string, scopeLabel: string, value: string) => {
    setGoalValues(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [scopeLabel]: value
      }
    }))
  }

  // 항목 삭제
  const handleRemoveScope = (category: string, scopeLabel: string) => {
    setGoalValues(prev => {
      const updated = {...prev[category]}
      delete updated[scopeLabel]
      return {
        ...prev,
        [category]: updated
      }
    })
  }

  // 선택된 scope만 필터링해서 보여주기
  const getVisibleScopes = () => {
    if (!selectedCategory) return []
    const existing = goalValues[selectedCategory] || {}
    return esgData.filter(item => item.label in existing)
  }

  // 처음 선택 시 모든 scope 입력 열기
  const handleSelect = (value: string) => {
    setSelectedCategory(value)
    setGoalValues(prev => {
      if (prev[value]) return prev // 이미 선택된 카테고리는 그대로
      const initialScopes: {[label: string]: string} = {}
      esgData.forEach(item => {
        initialScopes[item.label] = ''
      })
      return {
        ...prev,
        [value]: initialScopes
      }
    })
  }

  return (
    <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)}>
      <div className="flex w-full h-full font-apple">
        <div className="flex flex-col gap-y-3 w-full">
          <div className="font-apple text-2xl">목표 설정</div>
          <div className="flex w-full h-2 border-b-2" />

          {/* 카테고리 선택 */}
          <ComboboxWithCreate
            items={categoryOptions}
            selected={selectedCategory || ''}
            onAdd={() => {}}
            onSelect={handleSelect}
            placeholder="항목 선택"
          />

          {/* 선택된 카테고리 입력 폼 */}
          {selectedCategory && (
            <div className="mt-4 space-y-3">
              <div className="text-lg font-semibold">{selectedCategory}</div>

              {getVisibleScopes().map(item => (
                <div
                  key={item.label}
                  className="grid grid-cols-4 w-full gap-4 items-center text-center">
                  <span>{item.label}</span>
                  <div className="flex flex-row gap-4 items-center col-span-2">
                    <input
                      type="number"
                      className="w-full rounded-xl border-2 px-2 py-1"
                      placeholder="목표 설정"
                      value={goalValues[selectedCategory]?.[item.label] || ''}
                      onChange={e =>
                        handleInputChange(selectedCategory, item.label, e.target.value)
                      }
                    />
                    <span>{item.unit}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveScope(selectedCategory, item.label)}
                    className="text-white text-xl bg-red-500 rounded-2xl w-12"
                    title="삭제">
                    -
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
