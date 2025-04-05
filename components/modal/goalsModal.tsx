import {useESGModal} from './ESGModalContext'
import Modal from './Modal'

export default function goalsModal() {
  const {
    isGoalModalOpen, // 모달 열림 여부
    setIsGoalModalOpen // 모달 열기/닫기
  } = useESGModal()

  return (
    <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)}>
      <div className="flex flex-row w-full h-full justify-center font-apple">
        <div className="flex flex-col gap-y-3">
          {/* ------------------------------- */}
          {['Environmental'].map(label => (
            <div className="flex flex-row w-full">
              <span key={label} />
              <input type="number" className="w-[100px] h-[30px] rounded-xl border-2" />
              <span key={label} />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
