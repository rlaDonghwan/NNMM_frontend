'use client'

// React의 useEffect와 useState 훅을 가져옵니다.
import {useEffect, useState} from 'react'
// ESGModalContext에서 제공하는 useESGModal 훅을 가져옵니다.
import {useESGModal} from '@/components/modal/ESGModalContext'
// GridItem 컴포넌트를 가져옵니다.
import GridItem from './GridItem'
// 사용자 차트 데이터를 가져오는 fetchUserCharts 함수를 가져옵니다.
import {fetchUserCharts} from '@/services/chart-config'

// Social 컴포넌트를 기본 내보내기로 정의합니다.
export default function Social() {
  // 차트 리스트 상태를 관리하는 state
  const [gridItems, setGridItems] = useState([])
  // 삭제 모달 오픈 여부를 관리하는 state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  // 선택된 아이템 ID를 관리하는 state
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  // 로딩 상태를 관리하는 state
  const [isLoading, setIsLoading] = useState(true)
  // ESG 입력 모달 컨트롤 함수를 가져옵니다.
  const {setIsModalOpen} = useESGModal()

  // 컴포넌트가 마운트될 때 실행되는 useEffect
  useEffect(() => {
    // 차트를 불러오는 비동기 함수
    const loadCharts = async () => {
      try {
        // 사용자 차트 API 호출
        const data = await fetchUserCharts()
        // 상태 업데이트
        setGridItems(data)
      } catch (err) {
        // 에러 발생 시 콘솔에 출력
        console.error('차트 불러오기 실패:', err)
      } finally {
        // 로딩 상태를 false로 설정
        setIsLoading(false)
      }
    }

    // 차트 데이터를 로드합니다.
    loadCharts()
  }, [])

  // 아이템 클릭 시 호출되는 함수
  const handleClick = (item: any) => {
    if (item._id) {
      // 삭제할 항목 ID를 설정
      setSelectedItemId(item._id)
      // 삭제 모달을 오픈
      setIsEditModalOpen(true)
    } else {
      // ESG 입력 모달을 오픈
      setIsModalOpen(true)
    }
  }

  // 아이템을 드래그 앤 드롭으로 이동시키는 함수
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    // gridItems 배열을 복사
    const updated = [...gridItems]
    // 드래그된 아이템을 배열에서 제거
    const [removed] = updated.splice(dragIndex, 1)
    // 제거된 아이템을 새로운 위치에 삽입
    updated.splice(hoverIndex, 0, removed)
    // 상태 업데이트
    setGridItems(updated)
  }

  // 컴포넌트 렌더링
  return (
    <div className="font-apple w-full h-screen">
      {/* 화면 크기를 설정 */}
      {isLoading ? (
        // 로딩 중일 때 표시되는 메시지
        <p className="text-center text-gray-400 mt-10">차트를 불러오는 중입니다...</p>
      ) : (
        // 로딩이 끝난 후 그리드 레이아웃을 렌더링
        <div className="grid grid-cols-3 min-h-[600px] max-h-[600px] gap-4">
          {/* 그리드 아이템을 렌더링 */}
          {gridItems.map((item, index) => (
            <GridItem
              key={item._id || index} // key를 안전하게 처리
              item={item}
              index={index}
              isLast={false}
              moveItem={moveItem}
              handleClick={handleClick}
            />
          ))}
          {/* 추가 버튼을 위한 GridItem */}
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
      {/* 삭제 모달이 열려 있을 때 렌더링 */}
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
                  // 선택된 아이템을 삭제
                  setGridItems(prev => prev.filter(item => item._id !== selectedItemId))
                  // 삭제 모달 닫기
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
