'use client'

import React, {useRef} from 'react'
import {useDrag, useDrop} from 'react-dnd'
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  RadialLinearScale,
  Title
} from 'chart.js'
import {Bar, Line, Pie, Doughnut, PolarArea, Radar} from 'react-chartjs-2'

// Chart.js 컴포넌트 등록
ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  RadialLinearScale,
  Title
)

const ItemType = {
  BOX: 'box'
}

const chartComponentMap = {
  Bar,
  Line,
  Pie,
  Doughnut,
  PolarArea,
  Radar
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
    item: {index, id: item?._id},
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

  const ChartComponent = item.chartType && chartComponentMap[item.chartType]

  // 차트 데이터 구성
  const valuesArray = Array.isArray(item.values)
    ? item.values
    : item.values && typeof item.values === 'object'
    ? Object.values(item.values)
    : item.years?.map(() => 0) // fallback: 0값 배열

  const chartData =
    item?.labels?.length && valuesArray?.length
      ? {
          labels: item.labels,
          datasets: [
            {
              label: item.title || '차트',
              data: valuesArray,
              backgroundColor: item.colorSet || ['#60A5FA'],
              borderColor: item.colorSet || ['#60A5FA'],
              borderWidth: 2
            }
          ]
        }
      : null

  const isPieLike = ['Pie', 'Doughnut', 'PolarArea', 'Radar'].includes(item.chartType)

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {display: true, position: 'top'},
      title: {
        display: true,
        text: item.title || '',
        font: {size: 16, weight: 'bold'}
      }
    },
    scales: isPieLike ? {} : {y: {beginAtZero: true}}
  }
  //아래 사이즈 수정----------------------------------------------------------
  return (
    <div
      ref={ref}
      className="p-6 rounded-xl shadow-lg border-2 flex items-center justify-center cursor-pointer bg-white"
      // 그리드 shadow 및 border 추가
      style={{opacity: isDragging ? 0.5 : 1}}
      onClick={() => handleClick(isLast ? {} : item)}>
      {isLast ? (
        <span className="text-9xl text-gray-400">+</span>
      ) : ChartComponent && chartData ? (
        <ChartComponent data={chartData} options={chartOptions} />
      ) : (
        <div className="text-gray-400 text-sm text-center">
          차트를 불러올 수 없습니다
          <br />
          데이터를 확인해 주세요
        </div>
      )}
    </div>
  )
}
