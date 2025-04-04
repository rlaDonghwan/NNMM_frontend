'use client'

import {useEffect, useState} from 'react'
import {useESGModal, useEditESGModal} from '@/components/modal/ESGModalContext'
import ESGModal from '../modal/ESGModal'
import GridItem from './GridItem'
import {
  fetchChartDetail,
  fetchUserCharts,
  updateChartOrder
} from '@/services/chart-config'

export default function Environmental() {
  const [gridItems, setGridItems] = useState([]) // 대시보드에 표시될 아이템 리스트 상태
  const [selectedItemId, setSelectedItemId] = useState(null) // 선택된 아이템 ID
  const {setIsModalOpen, reset} = useESGModal()
  const {setIsEditModalOpen, setChartToEdit} = useEditESGModal() // 🔧 chartToEdit 추가
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCharts = async () => {
      try {
        const data = await fetchUserCharts('')
        const filtered = data
          .filter(chart => chart.category === 'environmental')
          .filter(
            chart =>
              chart.fields && chart.fields.length > 0 && chart.years && chart.chartType
          )
          .map(chart => ({
            ...chart,
            id: chart.chartId || chart._id // ✅ 여기서 id를 보장
          }))

        console.log('[✅ filtered charts]', filtered)
        setGridItems(filtered)
      } catch (err) {
        console.error('차트 불러오기 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCharts()
  }, [])

  const handleChartSaved = (newChart: any) => {
    setGridItems(prev => {
      const exists = prev.some(item => item._id === newChart._id)
      return exists
        ? prev.map(item => (item._id === newChart._id ? newChart : item))
        : [...prev, newChart]
    })
  }

  // 차트 클릭 시 (기존이면 수정 모달, 새로 만들기면 입력 모달)
  const handleClick = async (item: any) => {
    if (item._id) {
      try {
        // 🔥 서버에서 chart 상세 정보 불러오기
        const chartData = await fetchChartDetail(item.dashboardId, item._id)

        setChartToEdit(chartData) // Context에 chart 설정
        setIsEditModalOpen(true, updated => {
          setGridItems(prev => {
            const exists = prev.some(c => c._id === updated._id)
            return exists
              ? prev.map(c => (c._id === updated._id ? updated : c))
              : [...prev, updated]
          })
        })
      } catch (err) {
        console.error('차트 불러오기 실패:', err)
      }
    } else {
      // 신규 차트 생성
      setIsModalOpen(true, newChart => {
        setGridItems(prev => [...prev, newChart])
        setTimeout(() => {
          reset()
          setIsModalOpen(false)
        }, 100)
      })
    }
  }
  // 드래그 & 드롭 순서 저장
  const moveItem = async (dragIndex: number, hoverIndex: number) => {
    const updated = [...gridItems]
    const [removed] = updated.splice(dragIndex, 1)
    updated.splice(hoverIndex, 0, removed)

    const orderedWithOrder = updated.map((item, index) => ({
      ...item,
      order: index + 1,
      category: item.category ?? 'environmental',
      dashboardId: item.dashboardId // ✅ 반드시 포함되어야 함!
    }))

    setGridItems(orderedWithOrder)

    try {
      const formattedForRequest = orderedWithOrder.map(({_id, order, dashboardId}) => ({
        chartId: _id,
        dashboardId,
        newOrder: order
      }))
      await updateChartOrder(formattedForRequest)
      console.log('순서 저장 완료')
    } catch (err) {
      console.error('순서 저장 실패:', err)
    }
  }

  return (
    <div className="font-apple w-full h-screen">
      {isLoading ? (
        <p className="text-center text-gray-400 mt-10">차트를 불러오는 중입니다...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {gridItems.map((item, index) => (
            <GridItem
              key={item._id}
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
      )}
    </div>
  )
}
