'use client'

import {useEffect, useState} from 'react'
import {useESGModal} from '@/components/modal/ESGModalContext'
import ESGModal from '../modal/UnifiedESGModal'
import GridItem from './GridItem'
import {
  fetchChartDetail,
  fetchUserCharts,
  updateChartOrder
} from '@/services/chart-config'

export default function Environmental() {
  // 대시보드에 표시될 차트 목록 상태
  const [gridItems, setGridItems] = useState([])
  // ESG 모달 관련 상태 제어 함수들
  const {setIsModalOpen, reset, setChartToEdit, setIsEditModalOpen} = useESGModal()
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true)

  // 초기 마운트 시 차트 목록 불러오기
  useEffect(() => {
    const loadCharts = async () => {
      try {
        const data = await fetchUserCharts('')

        const filtered = data
          .filter(chart => chart.category === 'environmental') // 환경 카테고리만 필터링
          .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)) // order 기준 정렬
          .filter(
            chart =>
              chart.fields && chart.fields.length > 0 && chart.years && chart.chartType
          ) // 필수 필드 존재하는 차트만 필터링
          .map(chart => ({
            ...chart,
            id: chart.chartId || chart._id
          })) // id 보정

        setGridItems(filtered)
      } catch (err) {
        console.error('차트 불러오기 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCharts()
  }, [])
  //----------------------------------------------------------------------------------------------------

  // 모달 닫힌 후 콜백으로 데이터 반영하는 함수
  const handleChartSaved = (chart: any) => {
    if (!chart) return

    if (chart.deleted) {
      // 삭제된 항목은 목록에서 제거
      setGridItems(prev => prev.filter(item => item._id !== chart._id))
    } else {
      // 새로 추가되었거나 기존 항목이 수정된 경우 반영
      setGridItems(prev => {
        const exists = prev.some(item => item._id === chart._id)
        return exists
          ? prev.map(item => (item._id === chart._id ? chart : item))
          : [...prev, chart]
      })
    }
  }
  //----------------------------------------------------------------------------------------------------

  // 차트 클릭 시 수정 모달 열기
  const handleClick = async (item: any) => {
    if (item._id) {
      try {
        reset() // 이전 상태 초기화
        const chartData = await fetchChartDetail(item.dashboardId, item._id)
        setChartToEdit({...chartData, dashboardId: item.dashboardId})
        setIsEditModalOpen(true)
        setIsModalOpen(true, handleChartSaved) // 수정 모드 + 콜백 설정
      } catch (err) {
        console.error('차트 불러오기 실패:', err)
      }
    } else {
      reset() // 새 차트 입력
      setIsEditModalOpen(false)
      setIsModalOpen(true, handleChartSaved)
    }
  }
  //----------------------------------------------------------------------------------------------------

  // 차트 드래그로 순서 변경
  const moveItem = async (dragIndex: number, hoverIndex: number) => {
    const updated = [...gridItems]
    const [removed] = updated.splice(dragIndex, 1)
    updated.splice(hoverIndex, 0, removed)

    // 순서 반영하여 상태 업데이트
    const ordered = updated.map((item, index) => ({
      ...item,
      order: index + 1,
      dashboardId: item.dashboardId,
      category: item.category ?? 'environmental'
    }))

    setGridItems(ordered)

    try {
      // 서버에 순서 반영
      const requestPayload = ordered.map(({_id, order, dashboardId}) => ({
        chartId: _id,
        dashboardId,
        newOrder: order
      }))
      await updateChartOrder(requestPayload)
      console.log('순서 저장 완료')
    } catch (err) {
      console.error('순서 저장 실패:', err)
    }
  }
  //----------------------------------------------------------------------------------------------------

  return (
    <div className="font-apple w-full h-screen">
      {isLoading ? (
        <p className="text-center text-gray-400 mt-10 font-apple">
          차트를 불러오는 중입니다...
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {gridItems.map(
            (item, index) =>
              item.fields?.length ? (
                <GridItem
                  key={item._id ?? `chart-${index}`} // 중복 방지용 key
                  item={item}
                  index={index}
                  isLast={false}
                  moveItem={moveItem}
                  handleClick={handleClick}
                />
              ) : null // fields가 없으면 렌더링 제외
          )}
          <GridItem
            key="add-item"
            item={{}}
            index={gridItems.length}
            isLast={true} // 마지막은 ➕ 버튼용
            moveItem={moveItem}
            handleClick={handleClick}
          />
        </div>
      )}

      {/* ESG 차트 추가/수정 모달 */}
      <ESGModal category="environmental" onChartSaved={handleChartSaved} />
    </div>
  )
}
