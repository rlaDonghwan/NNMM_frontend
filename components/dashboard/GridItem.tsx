'use client'

import React, {useRef, useState} from 'react'
import {useDrag, useDrop} from 'react-dnd'

// Chart.js 관련 모듈 import 및 등록
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

// 즐겨찾기 아이콘
import {FaRegStar, FaStar} from 'react-icons/fa'

// 즐겨찾기 API
import {toggleFavoriteChart} from '@/services/chart-config'

// Chart.js 구성 요소 등록
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

// DnD 아이템 타입 정의
const ItemType = {
  BOX: 'box'
}

// 차트 타입 문자열 → 컴포넌트 매핑
const chartComponentMap = {
  bar: Bar,
  line: Line,
  pie: Pie,
  doughnut: Doughnut,
  polararea: PolarArea,
  radar: Radar
}

// DnD에서 사용될 드래그 아이템 타입
interface DragItem {
  id: string
  index: number
}

// props 정의
interface GridItemProps {
  item: any // 차트 아이템
  index: number
  isLast: boolean // 마지막 그리드인지 여부 (추가 버튼)
  moveItem: (dragIndex: number, hoverIndex: number) => void // 순서 변경 함수
  handleClick: (item: any) => void // 차트 클릭 시 핸들러
}

// 메인 컴포넌트
export default function GridItem({
  item,
  index,
  isLast,
  moveItem,
  handleClick
}: GridItemProps) {
  const ref = useRef(null)

  // useDrag: 드래그 가능한 요소로 설정
  const [{isDragging}, dragRef] = useDrag<DragItem, unknown, {isDragging: boolean}>({
    type: ItemType.BOX,
    item: {index, id: item?._id},
    canDrag: !isLast,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })
  //----------------------------------------------------------------------------------------------------

  // useDrop: 드롭 가능한 위치 설정
  const [, dropRef] = useDrop<DragItem>({
    accept: ItemType.BOX,
    hover: draggedItem => {
      if (!isLast && draggedItem.index !== index) {
        moveItem(draggedItem.index, index)
        draggedItem.index = index
      }
    }
  })
  //----------------------------------------------------------------------------------------------------

  // drag + drop 연결
  dragRef(dropRef(ref))

  // 차트 컴포넌트 및 타입 판단
  const chartTypeKey = item.chartType?.toLowerCase()
  const ChartComponent = chartComponentMap[chartTypeKey as keyof typeof chartComponentMap]
  const isPieLike = ['pie', 'doughnut', 'polararea', 'radar'].includes(chartTypeKey || '')

  // 데이터 없는 경우 null
  if (!item) return null

  // 차트 데이터 구성
  const chartData =
    item.fields?.length && item.years?.length
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
            labels: item.years,
            datasets: item.fields.map(f => ({
              label: f.label,
              data: item.years.map(y => Number(f.data?.[y]) || 0),
              backgroundColor: f.color || '#60A5FA',
              borderColor: f.color || '#60A5FA',
              borderWidth: 2
            }))
          }
      : null
  //----------------------------------------------------------------------------------------------------

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: isPieLike ? false : true,
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
  //----------------------------------------------------------------------------------------------------

  // 즐겨찾기 상태 로컬 저장
  const [isFavorite, setIsFavorite] = useState(item.isFavorite || false)
  //----------------------------------------------------------------------------------------------------

  return (
    <div
      ref={ref}
      className="py-2 px-4 rounded-xl shadow-lg border-2 flex items-center justify-center cursor-pointer bg-white"
      style={{opacity: isDragging ? 0.5 : 1}}
      onClick={() => handleClick(isLast ? {} : item)}>
      {/* 마지막 카드일 경우: ➕ 아이콘 */}
      {isLast ? (
        <span className="text-9xl text-gray-400">+</span>
      ) : ChartComponent && chartData ? (
        <ChartComponent
          data={chartData}
          options={chartOptions}
          className="flex w-full h-full justify-center items-center"
        />
      ) : (
        // 데이터가 없을 경우
        <div className="text-gray-400 text-sm text-center ">
          차트를 불러올 수 없습니다
          <br />
          데이터를 확인해 주세요
        </div>
      )}

      {/* ⭐ 즐겨찾기 버튼 */}
      {!isLast && (
        <button
          className="flex h-full justify-end items-start"
          onClick={async e => {
            e.stopPropagation() // 부모 클릭 막기

            const newFavorite = !isFavorite
            setIsFavorite(newFavorite)

            // ✅ API 호출로 즐겨찾기 상태 업데이트
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
