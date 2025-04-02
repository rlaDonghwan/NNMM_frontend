type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({isOpen, onClose, children}: ModalProps) {
  if (!isOpen) return null
  //사이즈 수정-------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-auto min-h-[60vh] max-h-[100vh] min-w-[65vw] max-w-[80vw] overflow-x-auto overflow-y-auto relative">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✖
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
