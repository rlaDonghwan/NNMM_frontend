import {useState} from 'react'
import {DndProvider, useDrag, useDrop} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

const ItemType = {
  BOX: 'box'
}

export default function Environment() {
  const [isModalOpen, setIsModalOpen] = useState(false) // 모달 열기/닫기 상태
  const [modalContent, setModalContent] = useState('') // 모달에 표시할 내용
  const [gridItems, setGridItems] = useState([]) // 초기 그리드 항목
  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // 수정 팝업 상태

  const handleClick = item => {
    if (item === '텍스트') {
      setIsEditModalOpen(true) // 수정 팝업 열기
    } else {
      setModalContent(`당신이 클릭한 항목: ${item}`)
      setIsModalOpen(true) // 일반 팝업 열기
    }
  }

  const closeModal = () => {
    setIsModalOpen(false) // 일반 팝업 닫기
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false) // 수정 팝업 닫기
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
    setGridItems(prevItems => [...prevItems, {id: Date.now(), color: getRandomColor()}]) // 랜덤 색상으로 "텍스트" 추가
    setIsModalOpen(false) // 모달 닫기
  }

  const moveItem = (dragIndex, hoverIndex) => {
    const updatedItems = [...gridItems]
    const [removed] = updatedItems.splice(dragIndex, 1)
    updatedItems.splice(hoverIndex, 0, removed)
    setGridItems(updatedItems)
  }

  const GridItem = ({item, index, isLast}) => {
    const [{isDragging}, dragRef] = useDrag({
      type: ItemType.BOX,
      item: {index},
      canDrag: !isLast, // "+" 칸은 드래그 불가능
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    })

    const [, dropRef] = useDrop({
      accept: ItemType.BOX,
      hover: draggedItem => {
        if (!isLast && draggedItem.index !== index) {
          moveItem(draggedItem.index, index)
          draggedItem.index = index
        }
      }
    })

    return (
      <div
        ref={node => dragRef(dropRef(node))}
        className={`p-6 rounded-xl shadow flex items-center justify-center cursor-pointer ${
          isLast ? 'bg-blue-100' : item.color
        }`}
        style={{opacity: isDragging ? 0.5 : 1}}
        onClick={() => handleClick(isLast ? '+' : '텍스트')}>
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
            gridTemplateColumns: 'repeat(3, 400px)', // 한 줄에 3개의 칸
            gridAutoRows: '300px' // 각 줄의 높이
          }}>
          {gridItems.map((item, index) => (
            <GridItem key={item.id} item={item} index={index} />
          ))}
          {/* "+" 칸은 항상 마지막에 고정 */}
          <GridItem key="add-button" isLast />
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
              <h2 className="text-xl font-semibold mb-4">수정 팝업</h2>
              <p>이곳에서 텍스트 칸을 수정할 수 있습니다.</p>
              <button
                onClick={closeEditModal}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                닫기
              </button>
              <button
                onClick={closeEditModal}
                className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded ml-4">
                수정
              </button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  )
}
