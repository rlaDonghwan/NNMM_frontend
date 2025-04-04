'use client'

import {useEffect, useState} from 'react'
import {useESGModal} from '@/components/modal/ESGModalContext'
import GridItem from './GridItem'
import {fetchUserCharts} from '@/services/chart-config'

export default function Social() {
  const [gridItems, setGridItems] = useState([]) // 차트 리스트 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // 삭제 모달 오픈 여부
  const [selectedItemId, setSelectedItemId] = useState(null) // 선택된 차트의 ID (삭제용)
  const [isLoading, setIsLoading] = useState(true) // 로딩 상태 여부
  const {setIsModalOpen, reset} = useESGModal() // 모달 열기 및 리셋 함수 가져오기

  //이렇게 useEffect써야 Favorite기능이 먹어서 여기 부분만 건들건들했습니다.
  useEffect(() => {
    const loadCharts = async () => {
      try {
        const data = await fetchUserCharts('')
        const filtered = data
          .filter(chart => chart.category === 'social')
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

  const handleClick = (item: any) => {
    if (item._id) {
      // 기존 차트 클릭 시 (삭제 모달 열기)
      setSelectedItemId(item._id) // 선택된 차트 ID 저장
      setIsEditModalOpen(true) // 삭제 확인 모달 오픈
    } else {
      // + 버튼 클릭 시 (새 차트 추가)
      setIsModalOpen(true, newChart => {
        setGridItems(prev => [...prev, newChart]) // 차트 리스트에 새 항목 추가
        setTimeout(() => {
          reset() // 모달 내부 상태 초기화
          setIsModalOpen(false) // 모달 닫기
        }, 300) // 0.3초 후 닫기
      })
    }
  }

  // 드래그 앤 드롭 시 위치 변경
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const updated = [...gridItems] // 기존 리스트 복사
    const [removed] = updated.splice(dragIndex, 1) // 드래그한 항목 제거
    updated.splice(hoverIndex, 0, removed) // 새로운 위치에 삽입
    setGridItems(updated) // 상태 업데이트
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
