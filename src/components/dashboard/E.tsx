import React from 'react'
import {useState} from 'react'
import {DndProvider, useDrag, useDrop} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

const ItemType = {
  BOX: 'box'
}

export default function Environment() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [gridItems, setGridItems] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null) // 선택된 아이템 ID

  const handleClick = item => {
    if (item.id) {
      setSelectedItemId(item.id) // 선택된 칼럼 ID 설정
      setIsEditModalOpen(true)
    } else {
      setModalContent(`당신이 클릭한 항목: ${item}`)
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
  }

  const handleDeleteItem = () => {
    setGridItems(prevItems => prevItems.filter(item => item.id !== selectedItemId)) // 선택된 아이템 삭제
    closeEditModal() // 모달 닫기
  }

  const getRandomColor = () => {
    const colors = [
      'bg-red-100',
      'bg-green-100',
      'bg-yellow-100',
      'bg-purple-100',
      'bg-pink-100'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleAddItem = () => {
    setGridItems(prevItems => [...prevItems, {id: Date.now(), color: getRandomColor()}])
    setIsModalOpen(false)
  }

  const moveItem = (dragIndex, hoverIndex) => {
    const updatedItems = [...gridItems]
    const [removed] = updatedItems.splice(dragIndex, 1)
    updatedItems.splice(hoverIndex, 0, removed)
    setGridItems(updatedItems)
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
    const ref = React.useRef<HTMLDivElement>(null)

    const [{isDragging}, dragRef] = useDrag({
      type: ItemType.BOX,
      item: {index, id: item?.id},
      canDrag: !isLast,
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    })

    const [, dropRef] = useDrop({
      accept: ItemType.BOX,
      hover: (draggedItem: {index: number}) => {
        if (!isLast && draggedItem.index !== index) {
          moveItem(draggedItem.index, index)
          draggedItem.index = index
        }
      }
    })

    dragRef(dropRef(ref))

    return (
      <div
        ref={ref} // 병합된 ref를 연결
        className={`p-6 rounded-xl shadow flex items-center justify-center cursor-pointer ${
          isLast ? 'bg-blue-100' : item.color
        }`}
        style={{opacity: isDragging ? 0.5 : 1}}
        onClick={() => handleClick(isLast ? '+' : item)}>
        <span className={`text-9xl ${isLast ? 'text-gray-500' : 'text-black'}`}>
          {isLast ? '+' : '텍스트'}
        </span>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {/* 그리드 레이아웃 */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(3, 400px)',
            gridAutoRows: '300px'
          }}>
          {gridItems.map((item, index) => (
            <GridItem key={item.id} item={item} index={index} isLast={undefined} />
          ))}
          <GridItem key="add-button" isLast item={undefined} index={undefined} />
        </div>

        {/* 일반 모달 팝업 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-xl font-semibold mb-4">팝업</h2>
              <p>{modalContent}</p>
              <button
                onClick={closeModal}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                닫기
              </button>
              <button
                onClick={handleAddItem}
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded ml-4">
                Add
              </button>
            </div>
          </div>
        )}

        {/* 수정 모달 팝업 */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-xl font-semibold mb-4">삭제 팝업</h2>
              <p>이 칼럼을 삭제하시겠습니까?</p>
              <button
                onClick={closeEditModal}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                닫기
              </button>
              <button
                onClick={handleDeleteItem}
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
