'use client'

import React, {useState, useEffect} from 'react' // React와 훅(useState, useEffect) 가져오기
import {DndProvider, useDrag, useDrop} from 'react-dnd' // React DnD 관련 훅 가져오기
import {HTML5Backend} from 'react-dnd-html5-backend' // React DnD의 HTML5 백엔드 가져오기
import axios from 'axios' // HTTP 요청을 위한 axios 라이브러리 가져오기
import Chartpage from '@/components/ui/charts/chartEx' // Chartpage 컴포넌트 가져오기

const ItemType = {
  BOX: 'box' // 드래그 앤 드롭에서 사용할 아이템 타입 정의
}

export default function Environmental() {
  const [isModalOpen, setIsModalOpen] = useState(false) // 일반 모달 상태 관리
  const [modalContent, setModalContent] = useState('') // 모달 내용 상태 관리
  const [gridItems, setGridItems] = useState([]) // 그리드 아이템 상태 관리
  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // 수정 모달 상태 관리
  const [selectedItemId, setSelectedItemId] = useState(null) // 선택된 아이템 ID 상태 관리

  const handleClick = item => {
    if (item.id) {
      setSelectedItemId(item.id) // 선택된 아이템 ID 설정
      setIsEditModalOpen(true) // 수정 모달 열기
    } else {
      setModalContent(`당신이 클릭한 항목: ${item}`) // 모달 내용 설정
      setIsModalOpen(true) // 일반 모달 열기
    }
  }

  const closeModal = () => {
    setIsModalOpen(false) // 일반 모달 닫기
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false) // 수정 모달 닫기
  }

  const handleDeleteItem = () => {
    const updatedItems = gridItems.filter(item => item.id !== selectedItemId) // 선택된 아이템 삭제
    setGridItems(updatedItems) // 상태 업데이트
    closeEditModal() // 수정 모달 닫기
  }

  const getRandomColor = () => {
    const colors = [
      'bg-red-100', // 빨간색 배경
      'bg-green-100', // 초록색 배경
      'bg-yellow-100', // 노란색 배경
      'bg-purple-100', // 보라색 배경
      'bg-pink-100' // 분홍색 배경
    ]
    return colors[Math.floor(Math.random() * colors.length)] // 랜덤 색상 반환
  }

  const handleAddItem = () => {
    const newItem = {id: Date.now(), color: getRandomColor()} // 새로운 아이템 생성
    const updatedItems = [...gridItems, newItem] // 기존 아이템에 추가
    setGridItems(updatedItems) // 상태 업데이트
    setIsModalOpen(false) // 일반 모달 닫기
  }

  const moveItem = (dragIndex, hoverIndex) => {
    const updatedItems = [...gridItems] // 기존 아이템 복사
    const [removed] = updatedItems.splice(dragIndex, 1) // 드래그된 아이템 제거
    updatedItems.splice(hoverIndex, 0, removed) // 드래그된 아이템을 새로운 위치에 삽입
    setGridItems(updatedItems) // 상태 업데이트
  }

  const GridItem = ({
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
      type: ItemType.BOX, // 드래그 타입 설정
      item: {index, id: item?.id}, // 드래그되는 아이템 정보
      canDrag: !isLast, // 마지막 아이템은 드래그 불가
      collect: monitor => ({
        isDragging: monitor.isDragging() // 드래그 상태 수집
      })
    })

    const [, dropRef] = useDrop({
      accept: ItemType.BOX, // 드롭 허용 타입 설정
      hover: (draggedItem: {index: number}) => {
        if (!isLast && draggedItem.index !== index) {
          moveItem(draggedItem.index, index) // 드래그된 아이템 이동
          draggedItem.index = index // 드래그된 아이템의 인덱스 업데이트
        }
      }
    })

    dragRef(dropRef(ref)) // 드래그와 드롭 ref 연결

    return (
      <div
        ref={ref} // DOM 참조 연결
        className={`p-6 rounded-xl shadow flex items-center justify-center cursor-pointer ${
          isLast ? 'bg-blue-100' : item.color // 마지막 아이템은 파란색 배경, 나머지는 지정된 색상
        }`}
        style={{opacity: isDragging ? 0.5 : 1}} // 드래그 중일 때 투명도 조정
        onClick={() => handleClick(isLast ? '+' : item)}>
        {/* 클릭 이벤트 처리 */}
        <span className={`text-9xl ${isLast ? 'text-gray-500' : 'text-black'}`}>
          {
            isLast ? '+' : <Chartpage /> // 마지막 아이템은 "+" 표시, 나머지는 차트 렌더링
          }
        </span>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {/* DnDProvider로 드래그 앤 드롭 기능 활성화 */}
      <div>
        {/* 그리드 레이아웃 */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(3, 400px)', // 3열 그리드
            gridAutoRows: '300px' // 행 높이 설정
          }}>
          {gridItems.map((item, index) => (
            <GridItem key={item.id} item={item} index={index} isLast={false} /> // 그리드 아이템 렌더링
          ))}
          <GridItem key="add-button" isLast={true} item={undefined} index={undefined} />
          {/* 추가 버튼 렌더링 */}
        </div>

        {/* 일반 모달 팝업 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-xl font-semibold mb-4">팝업</h2> {/* 모달 제목 */}
              <p>{modalContent}</p> {/* 모달 내용 */}
              <button
                onClick={closeModal}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                닫기 {/* 닫기 버튼 */}
              </button>
              <button
                onClick={handleAddItem}
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded ml-4">
                Add {/* 추가 버튼 */}
              </button>
            </div>
          </div>
        )}

        {/* 수정 모달 팝업 */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-xl font-semibold mb-4">삭제 팝업</h2>
              {/* 수정 모달 제목 */}
              <p>이 칼럼을 삭제하시겠습니까?</p> {/* 삭제 확인 메시지 */}
              <button
                onClick={closeEditModal}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                닫기 {/* 닫기 버튼 */}
              </button>
              <button
                onClick={handleDeleteItem}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded ml-4">
                삭제 {/* 삭제 버튼 */}
              </button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  )
}
