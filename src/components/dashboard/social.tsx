import React, {useState, useEffect} from 'react'
import {DndProvider, useDrag, useDrop} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import Modal from '../modal/Modal'
import ModalContent from '../modal/ModalContent'
import {
  fetchIndicators,
  createIndicators,
  submitESGReport,
  syncIndicators // ✅ 새로 추가된 함수
} from '@/services/esg'

const ItemType = {
  BOX: 'box'
}

export default function Social() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [gridItems, setGridItems] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [years, setYears] = useState([2021, 2022, 2023])
  const [rows, setRows] = useState([])
  const [indicators, setIndicators] = useState([])

  useEffect(() => {
    const loadIndicators = async () => {
      try {
        const data = await fetchIndicators('social')
        setIndicators(data)
      } catch (err) {
        console.error('지표 불러오기 실패:', err)
      }
    }
    loadIndicators()
  }, [])

  const handleValueChange = (rowIndex, year, value) => {
    const updated = [...rows]
    updated[rowIndex].values[year] = value
    setRows(updated)
  }

  const handleIndicatorChange = (rowIndex, key) => {
    const updated = [...rows]
    updated[rowIndex].indicatorKey = key
    setRows(updated)
  }

  const handleColorChange = (rowIndex, color) => {
    const updated = [...rows]
    updated[rowIndex].color = color
    setRows(updated)
  }

  const addRowWithIndicator = indicatorKey => {
    const newRow = {
      id: crypto.randomUUID(),
      indicatorKey,
      values: years.reduce((acc, y) => ({...acc, [y]: ''}), {}),
      color: '#cccccc'
    }
    setRows(prev => [...prev, newRow])
  }

  const removeRow = rowIndex => {
    const updated = [...rows]
    updated.splice(rowIndex, 1)
    setRows(updated)
  }

  const getUnit = key => {
    return indicators.find(i => i.key === key)?.unit || ''
  }

  const handleSubmit = async () => {
    try {
      await syncIndicators(indicators)
      await submitESGReport({category: 'social', years, rows})
      setIsModalOpen(false)
    } catch (error) {
      console.error('ESG 저장 오류:', error)
    }
  }

  const handleClick = item => {
    if (item.id) {
      setSelectedItemId(item.id)
      setIsEditModalOpen(true)
    } else {
      setIsModalOpen(true)
    }
  }

  const closeModal = () => setIsModalOpen(false)
  const closeEditModal = () => setIsEditModalOpen(false)

  const handleDeleteItem = () => {
    setGridItems(prev => prev.filter(item => item.id !== selectedItemId))
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

  const moveItem = (dragIndex, hoverIndex) => {
    const updated = [...gridItems]
    const [removed] = updated.splice(dragIndex, 1)
    updated.splice(hoverIndex, 0, removed)
    setGridItems(updated)
  }

  const GridItem = ({item, index, isLast}) => {
    const ref = React.useRef(null)

    const [{isDragging}, dragRef] = useDrag({
      type: ItemType.BOX,
      item: {index, id: item?.id},
      canDrag: !isLast,
      collect: monitor => ({isDragging: monitor.isDragging()})
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

    dragRef(dropRef(ref))

    return (
      <div
        ref={ref}
        className={`p-6 rounded-xl shadow flex items-center justify-center cursor-pointer ${
          isLast ? 'bg-blue-100' : item.color
        }`}
        style={{opacity: isDragging ? 0.5 : 1}}
        onClick={() => handleClick(isLast ? {} : item)}>
        <span className={`text-9xl ${isLast ? 'text-gray-500' : 'text-black'}`}>
          {isLast ? '+' : '텍스트'}
        </span>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div
          className="grid gap-4"
          style={{gridTemplateColumns: 'repeat(3, 400px)', gridAutoRows: '300px'}}>
          {gridItems.map((item, index) => (
            <GridItem key={item.id} item={item} index={index} isLast={false} />
          ))}
          <GridItem key="add-button" item={{}} index={gridItems.length} isLast={true} />
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalContent
            years={years}
            rows={rows}
            setRows={setRows}
            indicators={indicators}
            setIndicators={setIndicators}
            onAddYear={() => setYears([...years, Math.max(...years) + 1])}
            onRemoveYear={() => setYears(prev => prev.slice(0, -1))}
            onRemoveRow={removeRow}
            onValueChange={handleValueChange}
            getUnit={getUnit}
            onSubmit={handleSubmit}
            onAddRowWithIndicator={addRowWithIndicator}
            onIndicatorChange={handleIndicatorChange}
            onColorChange={handleColorChange}
          />
        </Modal>

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
