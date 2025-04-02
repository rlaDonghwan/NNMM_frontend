'use client'

import {useEffect, useState} from 'react'
import {useESGModal} from '@/components/modal/ESGModalContext'
import GridItem from './GridItem'
import {fetchUserCharts, updateChartOrder} from '@/services/chart-config'

export default function Governance() {
  // 상태 정의
  const [gridItems, setGridItems] = useState([]) // 대시보드에 표시될 차트 목록
  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // 삭제 모달 표시 여부
  const [selectedItemId, setSelectedItemId] = useState(null) // 삭제할 차트의 ID
  const [isLoading, setIsLoading] = useState(true) // 로딩 상태
  const {setIsModalOpen, reset} = useESGModal() // 모달 관련 context 함수

  // 컴포넌트 마운트 시 차트 불러오기
  useEffect(() => {
    const loadCharts = async () => {
      try {
        const data = await fetchUserCharts('') // 전체 차트 조회 API
        const filtered = data.filter(chart => chart.category === 'governance') // 거버넌스 차트만 필터링
        setGridItems(filtered) // 상태 업데이트
      } catch (err) {
        console.error('차트 불러오기 실패:', err) // 오류 로깅
      } finally {
        setIsLoading(false) // 로딩 완료
      }
    }

    loadCharts()
  }, [])

  // 차트 클릭 핸들러 (기존 차트 클릭 시 삭제, +버튼 클릭 시 추가)
  const handleClick = (item: any) => {
    if (item._id) {
      // 기존 차트 클릭 -> 삭제 모달 열기
      setSelectedItemId(item._id)
      setIsEditModalOpen(true)
    } else {
      // 새 차트 추가 버튼 클릭 -> 모달 열기
      setIsModalOpen(true, newChart => {
        setGridItems(prev => [...prev, newChart]) // 새 차트를 리스트에 추가
        setTimeout(() => {
          reset() // 모달 상태 초기화
          setIsModalOpen(false) // 모달 닫기
        }, 300)
      })
    }
  }

  // 드래그 앤 드롭으로 차트 순서 변경
  const moveItem = async (dragIndex: number, hoverIndex: number) => {
    const updated = [...gridItems] // 원본 리스트 복사
    const [removed] = updated.splice(dragIndex, 1) // 드래그한 항목 제거
    updated.splice(hoverIndex, 0, removed) // 새 위치에 삽입
    setGridItems(updated) // 상태 업데이트

    //소셜에는 없음---------------------------------------------------
    // 순서 변경 서버에 반영
    try {
      const orderedIds = updated.map(item => item.id) // 순서대로 ID 추출
      await updateChartOrder(orderedIds) // 순서 업데이트 API 호출
      console.log('순서 저장 완료') // 성공 로그
    } catch (err) {
      console.error('순서 저장 실패:', err) // 실패 로그
    }
  }
  //---------------------------------------------------

  return (
    <div className="font-apple w-full h-screen">
      {/* 로딩 중일 때 메시지 출력 */}
      {isLoading ? (
        <p className="text-center text-gray-400 mt-10">차트를 불러오는 중입니다...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {/* 차트 그리드 렌더링 */}
          {gridItems.map((item, index) => (
            <GridItem
              key={item.id ?? index} // 고유 key 설정
              item={item} // 차트 데이터
              index={index} // 인덱스 전달
              isLast={false} // 마지막 아이템 아님
              moveItem={moveItem} // 드래그 이벤트 전달
              handleClick={handleClick} // 클릭 이벤트 전달
            />
          ))}

          {/* + 버튼을 위한 빈 아이템 */}
          <GridItem
            key="add"
            item={{}} // 빈 객체
            index={gridItems.length} // 마지막 인덱스
            isLast={true} // 마지막 아이템 표시
            moveItem={moveItem}
            handleClick={handleClick}
          />
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center font-apple">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">삭제 팝업</h2>
            <p>이 칼럼을 삭제하시겠습니까?</p>
            <div className="flex justify-end">
              {/* 닫기 버튼 */}
              <button
                onClick={() => setIsEditModalOpen(false)} // 모달 닫기
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                닫기
              </button>
              {/* 삭제 버튼 */}
              <button
                onClick={() => {
                  setGridItems(prev => prev.filter(item => item.id !== selectedItemId)) // 해당 차트 제거
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
