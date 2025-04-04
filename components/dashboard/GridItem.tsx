'use client'

import React, {useRef, useState} from 'react'
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
// -----------------------------------------------------------------------즐겨찾기를 위한 별 추가
const BASE_URL = process.env.NEXT_PUBLIC_API_URL
import {FaRegStar, FaStar} from 'react-icons/fa'
import {toggleFavoriteChart} from '@/services/chart-config'
//------------------------------------------------------------------------여기까지

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
  bar: Bar,
  line: Line,
  pie: Pie,
  doughnut: Doughnut,
  polararea: PolarArea,
  radar: Radar
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

  const chartTypeKey = item.chartType?.toLowerCase()
  const ChartComponent = chartComponentMap[chartTypeKey as keyof typeof chartComponentMap]

  const isPieLike = ['pie', 'doughnut', 'polararea', 'radar'].includes(chartTypeKey || '')
  if (!item) {
    return null
  }
  // console.log(item)
  const chartData = item.fields?.length
    ? isPieLike
      ? {
          labels: item.fields.map(f => f.label),
          datasets: [
            {
              data: item.fields.map(f => {
                const firstYear = item.years?.[0]
                return Number(f.data?.[firstYear]) || 0
              }),
              backgroundColor: item.fields.map(f => f.color || '#60A5FA')
            }
          ]
        }
      : {
          labels: item.years || [],
          datasets: item.fields.map(f => ({
            label: f.label,
            data: (item.years || []).map(y => Number(f.data?.[y]) || 0),
            backgroundColor: f.color || '#60A5FA',
            borderColor: f.color || '#60A5FA',
            borderWidth: 2
          }))
        }
    : null

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {display: true, position: 'top' as const},
      title: {
        display: true,
        text: item.title || '',
        font: {size: 16, weight: 'bold' as const}
      }
    },
    scales: isPieLike ? {} : {y: {beginAtZero: true}}
  }

  //----------------------------------------------------------------Favorite 토글을 위한 상태 추가
  const [isFavorite, setIsFavorite] = useState(item.isFavorite || false) // 상태 추가
  const chartId = item.chartId
  const dashboardId = item.dashboardId
  console.log('[ChartId 확인]', item.chartId)
  console.log('[DashboardId 확인]', item.dashboardId)
  console.log('[UserId 확인]', item.userId)

  //----------------------------------------------------------------
  return (
    <div
      ref={ref}
      className="py-2 px-4 rounded-xl shadow-lg border-2 flex items-center justify-center cursor-pointer bg-white"
      style={{opacity: isDragging ? 0.5 : 1}}
      onClick={() => handleClick(isLast ? {} : item)}>
      {isLast ? (
        <span className="text-9xl text-gray-400">+</span>
      ) : ChartComponent && chartData ? (
        <ChartComponent
          data={chartData}
          options={chartOptions}
          className="flex w-full h-full justify-center items-center"
        />
      ) : (
        <div className="text-gray-400 text-sm text-center ">
          차트를 불러올 수 없습니다
          <br />
          데이터를 확인해 주세요
        </div>
      )}

      {/* 여기서부터 상진쓰가 만드는 코드 */}
      {!isLast && (
        <button
          className="flex h-full justify-end items-start"
          onClick={async e => {
            e.stopPropagation()

            const newFavorite = !isFavorite
            setIsFavorite(newFavorite)

            const success = await toggleFavoriteChart({
              dashboardId: item.dashboardId,
              chartId: item.chartId,
              userId: item.userId,
              isFavorite: newFavorite,
              onError: () => setIsFavorite(!newFavorite) // 실패 시 롤백
            })

            if (!success) {
              console.error('즐겨찾기 토글 실패 ❌')
            }
          }}>
          {isFavorite ? <FaStar /> : <FaRegStar />}
        </button>
      )}
    </div>
  )
}
