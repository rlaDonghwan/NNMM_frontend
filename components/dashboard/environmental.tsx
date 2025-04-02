'use client'

import {useEffect, useState} from 'react'
import {useESGModal} from '@/components/modal/ESGModalContext'
import ESGModal from '../modal/ESGModal'
import GridItem from './GridItem'
import {fetchUserCharts, updateChartOrder} from '@/services/chart-config'

export default function Environmental() {
  const [gridItems, setGridItems] = useState([]) // 차트 리스트 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // 삭제 모달 오픈 여부
  const [selectedItemId, setSelectedItemId] = useState(null) // 선택된 아이템 ID (삭제용)
  const [isLoading, setIsLoading] = useState(true) // 로딩 상태 여부
  const {setIsModalOpen, reset} = useESGModal() // 모달 열기 및 리셋 함수 가져오기

  // 마운트 시 차트 불러오기
  useEffect(() => {
    const loadCharts = async () => {
      try {
        const data = await fetchUserCharts('')
        const filtered = data
          .filter(chart => chart.category === 'environmental')
          //담에 붙는 애들은 안되면 지우면 됨 정렬 추가하는거임
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

  // 새 차트 저장 후 호출될 콜백
  const handleChartSaved = (newChart: any) => {
    setGridItems(prev => [...prev, newChart]) // 기존 차트 배열에 새 차트 추가
  }

  // 차트 클릭 시 (기존이면 삭제 모달, 새로 만들기면 입력 모달)

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

  // 드래그 & 드롭으로 아이템 정렬 원래 있던 코드
  // const moveItem = async (dragIndex: number, hoverIndex: number) => {
  //   const updated = [...gridItems] // 기존 배열 복사
  //   const [removed] = updated.splice(dragIndex, 1) // 드래그한 항목 제거
  //   updated.splice(hoverIndex, 0, removed) // 새로운 위치에 삽입

  //   setGridItems(updated) // 상태 업데이트
  //   try {
  //     const orderedIds = updated.map(item => item.id)
  //     await updateChartOrder(orderedIds)
  //     console.log('순서 저장 완료')
  //   } catch (err) {
  //     console.error('순서 저장 실패:', err)
  //   }
  // }

  //드래그 & 드롭 수정할 코드 수 틀리면 이거 지우고 위에꺼 살리기
  const moveItem = async (dragIndex: number, hoverIndex: number) => {
    const updated = [...gridItems] // 기존 배열 복사
    const [removed] = updated.splice(dragIndex, 1) // 드래그한 항목 제거
    updated.splice(hoverIndex, 0, removed) // 새로운 위치에 삽입

    const orderedWithOrder = updated.map((Item, index) => ({
      ...Item,
      order: index + 1
    }))
    setGridItems(orderedWithOrder) // 상태 업데이트
    try {
      console.log('[updateChartOrder] 요청 데이터:', orderedWithOrder)
      await updateChartOrder(orderedWithOrder)
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
