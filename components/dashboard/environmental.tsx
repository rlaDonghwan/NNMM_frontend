'use client'

import {useEffect, useState} from 'react'
import {useESGModal} from '@/components/modal/ESGModalContext'
import GridItem from './GridItem'
import {fetchUserCharts, updateChartOrder} from '@/services/chart-config'

export default function Environmental() {
  const [gridItems, setGridItems] = useState([]) // 대시보드에 표시될 아이템 리스트 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // 삭제 모달 오픈 여부
  const [selectedItemId, setSelectedItemId] = useState(null) // 선택된 아이템 ID
  const {setIsModalOpen, reset} = useESGModal() // 모달 열기 및 리셋 함수 가져오기
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCharts = async () => {
      try {
        const data = await fetchUserCharts('')
        const filtered = data
          .filter(chart => chart.category === 'environmental')
          .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
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

  // 차트 클릭 시 (기존이면 삭제 모달, 새로 만들기면 입력 모달)
  const handleClick = (item: any) => {
    if (item._id) {
      setSelectedItemId(item._id)
      setIsEditModalOpen(true)
    } else {
      setIsModalOpen(true, newChart => {
        setGridItems(prev => {
          const exists = prev.some(item => item._id === newChart._id)
          return exists
            ? prev.map(item => (item._id === newChart._id ? newChart : item))
            : [...prev, newChart]
        })
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
      // ✅ 순서 + dashboardId 포함된 데이터 전달
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
      {/* 로딩 중이면 메시지 출력 */}
      {isLoading ? (
        <p className="text-center text-gray-400 mt-10">차트를 불러오는 중입니다...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {/* 차트 카드 목록 출력 */}
          {gridItems.map((item, index) => (
            <GridItem
              key={item._id} // 키 값 (없으면 인덱스로 대체)
              item={item} // 차트 데이터
              index={index} // 현재 인덱스
              isLast={false} // 마지막 아이템 아님
              moveItem={moveItem} // 드래그 함수
              handleClick={handleClick} // 클릭 핸들러
            />
          ))}
          {/* + 버튼용 빈 아이템 */}
          <GridItem
            key="add"
            item={{}} // 빈 데이터
            index={gridItems.length} // 마지막 인덱스
            isLast={true} // 마지막 아이템임
            moveItem={moveItem}
            handleClick={handleClick}
          />
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center font-apple">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">삭제 확인</h2>
            <p>이 차트를 삭제하시겠습니까?</p>
            <div className="flex justify-end">
              {/* 닫기 버튼 */}
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                닫기
              </button>
              {/* 삭제 버튼 */}
              <button
                onClick={() => {
                  setGridItems(prev => prev.filter(item => item._id !== selectedItemId)) // 해당 ID의 차트 삭제
                  setIsEditModalOpen(false) // 모달 닫기
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
