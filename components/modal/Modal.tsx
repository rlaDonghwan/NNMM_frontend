// 모달 컴포넌트의 props 타입 정의
type ModalProps = {
  isOpen: boolean // 모달 열림 여부
  onClose: () => void // 모달 닫기 함수
  children: React.ReactNode // 모달 내부에 렌더링할 컴포넌트들
}

// 기본 Modal 컴포넌트 정의
export default function Modal({isOpen, onClose, children}: ModalProps) {
  if (!isOpen) return null // 열려있지 않으면 아무것도 렌더링하지 않음

  return (
    // 모달 배경: 검정 반투명 배경과 화면 중앙 정렬
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      {/* 모달 박스: 흰 배경, 그림자, 둥근 테두리, 스크롤 가능 크기 */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-auto min-h-[60vh] max-h-[100vh] min-w-[65vw] max-w-[80vw] overflow-x-auto overflow-y-auto relative">
        {/* 닫기 버튼 (우측 상단 X 아이콘) */}
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✖
          </button>
        </div>

        {/* 자식 요소 렌더링 (ModalContent, SecondModalContent 등) */}
        {children}
      </div>
    </div>
  )
}
