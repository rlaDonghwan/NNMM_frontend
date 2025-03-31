'use client'

import {useState} from 'react'
import {useESGModal} from '@/components/modal/ESGModalContext'
import GridItem from './GridItem'

export default function Social() {
  const [gridItems, setGridItems] = useState([]) // 대시보드에 표시될 아이템 리스트 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // 삭제 모달 오픈 여부
  const [selectedItemId, setSelectedItemId] = useState(null) // 선택된 아이템 ID
  const {setIsModalOpen} = useESGModal() // ESG 입력 모달 컨트롤 함수

  // 아이템 클릭 시 호출되는 함수 (신규 추가 또는 기존 수정)
  const handleClick = (item: any) => {
    if (item.id) {
      setSelectedItemId(item.id) // 수정할 항목 선택
      setIsEditModalOpen(true) // 삭제 모달 열기
    } else {
      setIsModalOpen(true) // ESG 입력 모달 열기
    }
  }

  // 드래그 & 드롭으로 아이템 정렬
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const updated = [...gridItems] // 기존 배열 복사
    const [removed] = updated.splice(dragIndex, 1) // 드래그한 항목 제거
    updated.splice(hoverIndex, 0, removed) // 새로운 위치에 삽입
    setGridItems(updated) // 상태 업데이트
  }

  return (
    <div className="font-apple">
      {' '}
      {/* 전체에 font-apple 적용 */}
      <div
        className="grid gap-4"
        style={{gridTemplateColumns: 'repeat(3, 400px)', gridAutoRows: '300px'}}>
        {gridItems.map((item, index) => (
          <GridItem
            key={item.id} // 고유 키
            item={item} // 아이템 데이터
            index={index} // 인덱스
            isLast={false} // 마지막 그리드 여부 (항상 false)
            moveItem={moveItem} // 드래그 함수
            handleClick={handleClick} // 클릭 이벤트
          />
        ))}
        {/* 추가 버튼 그리드 */}
        <GridItem
          key="add"
          item={{}} // 빈 item
          index={gridItems.length}
          isLast={true} // 마지막 요소임을 표시
          moveItem={moveItem}
          handleClick={handleClick}
        />
      </div>
      {/* 삭제 확인 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center font-apple">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">삭제 팝업</h2>
            <p>이 칼럼을 삭제하시겠습니까?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditModalOpen(false)} // 모달 닫기
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                닫기
              </button>
              <button
                onClick={() => {
                  // 해당 아이템 삭제
                  setGridItems(prev => prev.filter(item => item.id !== selectedItemId))
                  setIsEditModalOpen(false)
                }}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded ml-4">
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
