'use client'
//.

import React from 'react' // React 라이브러리 임포트
import {useState} from 'react' // useState 훅 임포트
import {DndProvider, useDrag, useDrop} from 'react-dnd' // react-dnd의 DnD 관련 훅 임포트
import {HTML5Backend} from 'react-dnd-html5-backend' // HTML5 DnD 백엔드 임포트

const ItemType = {
  BOX: 'box' // 드래그 앤 드롭에서 사용할 아이템 타입 정의
}

export default function Governance() {
  // Governance 컴포넌트 정의
  const [isModalOpen, setIsModalOpen] = useState(false) // 일반 모달 열림 상태 관리
  const [modalContent, setModalContent] = useState('') // 일반 모달 내용 관리
  const [gridItems, setGridItems] = useState([]) // 그리드 아이템 상태 관리
  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // 수정 모달 열림 상태 관리
  const [selectedItemId, setSelectedItemId] = useState(null) // 선택된 아이템 ID 상태 관리

  const handleClick = item => {
    // 아이템 클릭 시 동작 정의
    if (item.id) {
      // 아이템에 ID가 있으면
      setSelectedItemId(item.id) // 선택된 아이템 ID 설정
      setIsEditModalOpen(true) // 수정 모달 열기
    } else {
      // 아이템에 ID가 없으면
      setModalContent(`당신이 클릭한 항목: ${item}`) // 모달 내용 설정
      setIsModalOpen(true) // 일반 모달 열기
    }
  }

  const closeModal = () => {
    // 일반 모달 닫기 함수
    setIsModalOpen(false)
  }

  const closeEditModal = () => {
    // 수정 모달 닫기 함수
    setIsEditModalOpen(false)
  }

  const handleDeleteItem = () => {
    // 아이템 삭제 함수
    setGridItems(prevItems => prevItems.filter(item => item.id !== selectedItemId)) // 선택된 아이템 삭제
    closeEditModal() // 수정 모달 닫기
  }

  const getRandomColor = () => {
    // 랜덤 배경색 반환 함수
    const colors = [
      'bg-red-100',
      'bg-green-100',
      'bg-yellow-100',
      'bg-purple-100',
      'bg-pink-100'
    ]
    return colors[Math.floor(Math.random() * colors.length)] // 랜덤 색상 반환
  }

  const handleAddItem = () => {
    // 아이템 추가 함수
    setGridItems(prevItems => [...prevItems, {id: Date.now(), color: getRandomColor()}]) // 새로운 아이템 추가
    setIsModalOpen(false) // 일반 모달 닫기
  }

  const moveItem = (dragIndex, hoverIndex) => {
    // 아이템 순서 변경 함수
    const updatedItems = [...gridItems] // 기존 아이템 복사
    const [removed] = updatedItems.splice(dragIndex, 1) // 드래그된 아이템 제거
    updatedItems.splice(hoverIndex, 0, removed) // 드래그된 아이템 새 위치에 삽입
    setGridItems(updatedItems) // 업데이트된 아이템 상태 설정
  }

  const GridItem = ({
    // 그리드 아이템 컴포넌트
    item,
    index,
    isLast
  }: {
    item: any
    index: number
    isLast: boolean
  }) => {
    const ref = React.useRef<HTMLDivElement>(null) // DOM 참조를 위한 ref 생성

    const [{isDragging}, dragRef] = useDrag({
      // 드래그 훅 사용
      type: ItemType.BOX, // 드래그 타입 설정
      item: {index, id: item?.id}, // 드래그 시 전달할 데이터
      canDrag: !isLast, // 마지막 아이템은 드래그 불가
      collect: monitor => ({
        isDragging: monitor.isDragging() // 드래그 상태 수집
      })
    })

    const [, dropRef] = useDrop({
      // 드롭 훅 사용
      accept: ItemType.BOX, // 드롭 가능한 타입 설정
      hover: (draggedItem: {index: number}) => {
        // 드롭 시 동작 정의
        if (!isLast && draggedItem.index !== index) {
          // 마지막 아이템이 아니고, 드래그된 아이템의 인덱스가 다르면
          moveItem(draggedItem.index, index) // 아이템 순서 변경
          draggedItem.index = index // 드래그된 아이템의 인덱스 업데이트
        }
      }
    })

    dragRef(dropRef(ref)) // 드래그와 드롭 ref 병합

    return (
      <div
        ref={ref} // 병합된 ref 연결
        className={`p-6 rounded-xl shadow flex items-center justify-center cursor-pointer ${
          isLast ? 'bg-blue-100' : item.color // 마지막 아이템이면 파란색 배경, 아니면 아이템 색상
        }`}
        style={{opacity: isDragging ? 0.5 : 1}} // 드래그 중이면 투명도 조정
        onClick={() => handleClick(isLast ? '+' : item)}>
        {/* 클릭 시 동작 */}
        <span className={`text-9xl ${isLast ? 'text-gray-500' : 'text-black'}`}>
          {/* 텍스트 스타일 */}
          {isLast ? '+' : '텍스트'}
          {/* 마지막 아이템이면 '+' 표시, 아니면 '텍스트' 표시 */}
        </span>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {/* DnDProvider로 드래그 앤 드롭 컨텍스트 제공 */}
      <div>
        {/* 그리드 레이아웃 */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(3, 400px)', // 3열 그리드
            gridAutoRows: '300px' // 행 높이 설정
          }}>
          {gridItems.map(
            (
              item,
              index // 그리드 아이템 렌더링
            ) => (
              <GridItem key={item.id} item={item} index={index} isLast={undefined} />
            )
          )}
          <GridItem key="add-button" isLast item={undefined} index={undefined} />
          {/* 추가 버튼 */}
        </div>

        {/* 일반 모달 팝업 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            {/* 모달 배경 */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              {/* 모달 내용 */}
              <h2 className="text-xl font-semibold mb-4">팝업</h2> {/* 모달 제목 */}
              <p>{modalContent}</p> {/* 모달 내용 */}
              <button
                onClick={closeModal} // 닫기 버튼 클릭 시 모달 닫기
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                닫기
              </button>
              <button
                onClick={handleAddItem} // 추가 버튼 클릭 시 아이템 추가
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded ml-4">
                Add
              </button>
            </div>
          </div>
        )}

        {/* 수정 모달 팝업 */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            {/* 모달 배경 */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              {/* 모달 내용 */}
              <h2 className="text-xl font-semibold mb-4">삭제 팝업</h2> {/* 모달 제목 */}
              <p>이 칼럼을 삭제하시겠습니까?</p> {/* 삭제 확인 메시지 */}
              <button
                onClick={closeEditModal} // 닫기 버튼 클릭 시 모달 닫기
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                닫기
              </button>
              <button
                onClick={handleDeleteItem} // 삭제 버튼 클릭 시 아이템 삭제
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded ml-4">
                삭제
              </button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  )
}
