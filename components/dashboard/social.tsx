'use client'

import {useState} from 'react'
import {useESGModal} from '@/components/modal/ESGModalContext'
import GridItem from './GridItem'

export default function Social() {
  const [gridItems, setGridItems] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)

  const {setIsModalOpen} = useESGModal()

  // 아이템 클릭 시 (추가 or 수정)
  const handleClick = (item: any) => {
    if (item.id) {
      setSelectedItemId(item.id)
      setIsEditModalOpen(true)
    } else {
      setIsModalOpen(true)
    }
  }

  // 드래그 & 드롭 정렬 로직
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const updated = [...gridItems]
    const [removed] = updated.splice(dragIndex, 1)
    updated.splice(hoverIndex, 0, removed)
    setGridItems(updated)
  }

  return (
    <div>
      <div
        className="grid gap-4"
        style={{gridTemplateColumns: 'repeat(3, 400px)', gridAutoRows: '300px'}}>
        {gridItems.map((item, index) => (
          <GridItem
            key={item.id}
            item={item}
            index={index}
            isLast={false}
            moveItem={moveItem}
            handleClick={handleClick}
          />
        ))}
        <GridItem
          key="add"
          item={{}}
          index={gridItems.length}
          isLast={true}
          moveItem={moveItem}
          handleClick={handleClick}
        />
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">삭제 팝업</h2>
            <p>이 칼럼을 삭제하시겠습니까?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                닫기
              </button>
              <button
                onClick={() => {
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
