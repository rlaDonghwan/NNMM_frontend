'use client'

import {useEffect, useState} from 'react'
import {useESGModal} from '@/components/modal/ESGModalContext'
import GridItem from './GridItem'
import {fetchUserCharts} from '@/services/chart-config'

export default function Environmental() {
  const [gridItems, setGridItems] = useState([]) // 차트 리스트 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // 삭제 모달 오픈 여부
  const [selectedItemId, setSelectedItemId] = useState(null) // 선택된 아이템 ID (삭제용)
  const [isLoading, setIsLoading] = useState(true) // 로딩 중 여부
  const {setIsModalOpen} = useESGModal() // ESG 입력 모달 열기 함수

  // 마운트 시 차트 불러오기
  useEffect(() => {
    const loadCharts = async () => {
      try {
        const data = await fetchUserCharts('') // 유저 차트 전체 불러오기
        const filtered = data.filter(chart => chart.category === 'environmental') // 환경 카테고리만 필터링
        setGridItems(filtered) // 그리드 상태에 반영
      } catch (err) {
        console.error('차트 불러오기 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCharts()
  }, [])

  // 새 차트 저장 후 호출될 콜백
  const handleChartSaved = (newChart: any) => {
    setGridItems(prev => [...prev, newChart]) // 기존 차트 배열에 새 차트 추가
  }

  // 차트 클릭 시 (기존이면 삭제 모달, 새로 만들기면 입력 모달)
  const handleClick = (item: any) => {
    if (item._id) {
      setSelectedItemId(item._id) // 선택한 항목 ID 저장
      setIsEditModalOpen(true) // 삭제 모달 오픈
    } else {
      setIsModalOpen(true, newChart => {
        setGridItems(prev => [...prev, newChart]) // 새 차트 저장 콜백 전달
      })
    }
  }

  // 드래그 앤 드롭 정렬 처리
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const updated = [...gridItems]
    const [removed] = updated.splice(dragIndex, 1)
    updated.splice(hoverIndex, 0, removed)
    setGridItems(updated) // 순서 갱신
  }

  return (
    <div className="font-apple px-6 py-4">
      {isLoading ? (
        <p className="text-center text-gray-400 mt-10">차트를 불러오는 중입니다...</p>
      ) : (
        <div
          className="grid gap-4"
          style={{gridTemplateColumns: 'repeat(3, 400px)', gridAutoRows: '300px'}}>
          {gridItems.map((item, index) => (
            <GridItem
              key={item._id || index} // key는 _id 없을 경우 index로 처리
              item={item}
              index={index}
              isLast={false}
              moveItem={moveItem} // 드래그 이동
              handleClick={handleClick} // 클릭 이벤트 (모달 열기)
            />
          ))}

          {/* 새 차트 추가 버튼 */}
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

      {/* 삭제 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center font-apple">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">삭제 확인</h2>
            <p>이 차트를 삭제하시겠습니까?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditModalOpen(false)} // 취소
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                닫기
              </button>
              <button
                onClick={() => {
                  setGridItems(prev => prev.filter(item => item._id !== selectedItemId)) // 해당 ID 삭제
                  setIsEditModalOpen(false)
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
