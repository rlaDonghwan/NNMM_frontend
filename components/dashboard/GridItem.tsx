'use client'

import React, {useRef} from 'react'
import {useDrag, useDrop} from 'react-dnd'

const ItemType = {
  BOX: 'box'
}

interface DragItem {
  id: string
  index: number
}

interface GridItemProps {
  item: any
  index: number
  isLast: boolean
  moveItem: (dragIndex: number, hoverIndex: number) => void
  handleClick: (item: any) => void
}

export default function GridItem({
  item,
  index,
  isLast,
  moveItem,
  handleClick
}: GridItemProps) {
  const ref = useRef(null)

  const [{isDragging}, dragRef] = useDrag<DragItem, unknown, {isDragging: boolean}>({
    type: ItemType.BOX,
    item: {index, id: item?.id},
    canDrag: !isLast,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const [, dropRef] = useDrop<DragItem>({
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
