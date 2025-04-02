'use client'

import {useEffect, useState} from 'react'
import {useESGModal} from '@/components/modal/ESGModalContext'
import GridItem from './GridItem'
import {fetchUserCharts} from '@/services/chart-config'

export default function Social() {
  const [gridItems, setGridItems] = useState([]) // 차트 리스트 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // 삭제 모달 오픈 여부
  //const [selectedItemId, setSelectedItemId] = useState<string | null>(null) // 선택된 아이템 ID
  const [selectedItemId, setSelectedItemId] = useState(null) // 선택된 아이템 ID
  const [isLoading, setIsLoading] = useState(true) // 로딩 상태
  const {setIsModalOpen} = useESGModal() // ESG 입력 모달 컨트롤 함수
  useEffect(() => {
    const loadCharts = async () => {
      try {
        const data = await fetchUserCharts('')
        const filtered = data.filter(chart => chart.category === 'social')
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
      setSelectedItemId(item._id) // 삭제할 항목 설정
      setIsEditModalOpen(true) // 삭제 모달 오픈
    } else {
      setIsModalOpen(true) // ESG 입력 모달 오픈
    }
  }

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const updated = [...gridItems]
    const [removed] = updated.splice(dragIndex, 1)
    updated.splice(hoverIndex, 0, removed)
    setGridItems(updated)
  }
  //-----------------------------------------------------------html 코드 수정 (그리드 사이즈 조정)
  return (
    <div className="font-apple w-full h-screen">
      {/* w-full h-screen 추가------------------------------------------------------------ */}
      {isLoading ? (
        <p className="text-center text-gray-400 mt-10">차트를 불러오는 중입니다...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {/* grid-cols-3 및 min-h-[]추가--------------------------------------------------- */}
          {gridItems.map((item, index) => (
            <GridItem
              key={item._id || index} // key 안전 처리
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

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center font-apple">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">삭제 확인</h2>
            <p>이 차트를 삭제하시겠습니까?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                닫기
              </button>
              <button
                onClick={() => {
                  setGridItems(prev => prev.filter(item => item._id !== selectedItemId))
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
