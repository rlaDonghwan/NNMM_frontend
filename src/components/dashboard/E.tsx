import React, {useState, useEffect} from 'react'
import {DndProvider, useDrag, useDrop} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import axios from 'axios'
import Chartpage from '../ui/charts/chartEx'

const ItemType = {
  BOX: 'box'
}

const apiUrl = 'https://localhost:4000/api/columns' // 백엔드 API URL

export default function Environment() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [gridItems, setGridItems] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)

  // 초기 데이터 로드
  useEffect(() => {
    const fetchGridItems = async () => {
      try {
        const response = await axios.get(`${apiUrl}/get`) // 백엔드에서 컬럼 데이터를 가져오는 API 호출
        setGridItems(response.data)
      } catch (error) {
        console.error('컬럼 데이터 로드 실패:', error)
      }
    }
    fetchGridItems()
  }, [])

  const sendColumnsToBackend = async updatedItems => {
    try {
      await axios.post(`${apiUrl}/update`, {
        columns: updatedItems
      })
    } catch (error) {
      console.error('컬럼 업데이트 실패:', error)
    }
  }

  const handleClick = item => {
    if (item.id) {
      setSelectedItemId(item.id)
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
    const updatedItems = gridItems.filter(item => item.id !== selectedItemId)
    setGridItems(updatedItems)
    sendColumnsToBackend(updatedItems) // 삭제 후 백엔드로 컬럼 순서 전송
    closeEditModal()
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
    const newItem = {id: Date.now(), color: getRandomColor()}
    const updatedItems = [...gridItems, newItem]
    setGridItems(updatedItems)
    sendColumnsToBackend(updatedItems) // 추가 후 백엔드로 컬럼 순서 전송
    setIsModalOpen(false)
  }

  const moveItem = (dragIndex, hoverIndex) => {
    const updatedItems = [...gridItems]
    const [removed] = updatedItems.splice(dragIndex, 1)
    updatedItems.splice(hoverIndex, 0, removed)
    setGridItems(updatedItems)
    sendColumnsToBackend(updatedItems) // 순서 변경 후 백엔드로 컬럼 순서 전송
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
        ref={ref}
        className={`p-6 rounded-xl shadow flex items-center justify-center cursor-pointer ${
          isLast ? 'bg-blue-100' : item.color
        }`}
        style={{opacity: isDragging ? 0.5 : 1}}
        onClick={() => handleClick(isLast ? '+' : item)}>
        <span className={`text-9xl ${isLast ? 'text-gray-500' : 'text-black'}`}>
          {
            isLast ? '+' : <Chartpage /> // Component에서 차트를 정상적으로 렌더링하도록 수정
          }
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
            <GridItem key={item.id} item={item} index={index} isLast={false} /> // isLast를 false로 설정하여 차트 렌더링
          ))}
          <GridItem key="add-button" isLast={true} item={undefined} index={undefined} />
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
