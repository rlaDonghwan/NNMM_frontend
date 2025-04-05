'use client'

import {useEffect, useState} from 'react'
import {useESGModal} from '@/components/modal/ESGModalContext'
import GridItem from './GridItem'
import {fetchUserCharts, updateChartOrder} from '@/services/chart-config'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'
import {Bar, Pie} from 'react-chartjs-2'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import GoalsModal from '@/components/modal/goalsModal' // ✅ 수정된 이름으로 import

export default function TotalDashboard() {
  const [gridItems, setGridItems] = useState<any[]>([])
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const {setIsModalOpen, reset, setIsGoalModalOpen} = useESGModal() // ✅ goal 모달 상태 함수 가져오기

  useEffect(() => {
    const loadFavoriteCharts = async () => {
      try {
        const data = await fetchUserCharts('')
        const favoritesOnly = data
          .filter(chart => chart.isFavorite === true)
          .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
        setGridItems(favoritesOnly)
      } catch (err) {
        console.error('즐겨찾기 차트 불러오기 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadFavoriteCharts()
  }, [])

  const handleChartSaved = (newChart: any) => {
    setGridItems(prev => {
      const exists = prev.some(item => item._id === newChart._id)
      return exists
        ? prev.map(item => (item._id === newChart._id ? newChart : item))
        : [...prev, newChart]
    })
  }

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

  // ✅ 목표 설정 버튼 클릭 시 goal 모달 열기
  const handleGoalClick = () => {
    setIsGoalModalOpen(true)
  }

  const moveItem = async (dragIndex: number, hoverIndex: number) => {
    const updated = [...gridItems]
    const [removed] = updated.splice(dragIndex, 1)
    updated.splice(hoverIndex, 0, removed)

    const orderedWithOrder = updated.map((item, index) => ({
      ...item,
      order: index + 1,
      category: item.category ?? 'governance',
      dashboardId: item.dashboardId
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

  const data = {
    labels: ['Used', 'Remaining'],
    datasets: [
      {
        data: [12, 88],
        backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(200, 200, 200, 0.2)'],
        borderWidth: 0
      }
    ]
  }

  const options = {
    indexAxis: 'y' as const,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: 100
      }
    }
  }

  const data2 = {
    labels: ['E', 'S', 'G'],
    datasets: [
      {
        label: '비율',
        data: [23, 21, 56],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(200, 200, 200, 0.2)'
        ]
      }
    ]
  }

  return (
    <div className="flex flex-col gap-y-4 w-full h-screen">
      {/* ✅ 목표 설정 버튼 */}
      <button
        className="w-[110px] h-[36px] border-2 rounded-xl font-apple"
        onClick={handleGoalClick}>
        목표 설정
      </button>

      {/* ✅ 목표 설정 모달 */}
      <GoalsModal />

      <div className="grid grid-cols-[2.02fr_0.98fr] gap-4 h-full w-full">
        <div className="bg-white rounded-xl shadow-lg border-2 p-4">
          <div className="flex flex-row gap-4 h-full w-full justify-center">
            {['Environmental', 'Social', 'Governance'].map(label => (
              <div>
                <div className="flex justify-center">
                  <ComboboxWithCreate
                    items={['2020', '2021', '2022', '2023']}
                    placeholder={label}
                    onAdd={() => {}}
                    onSelect={() => {}}
                  />
                </div>
                <div className="h-[270px] mt-2">
                  <Pie data={data} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 p-4">
          <div className="flex flex-row w-full justify-center font-apple">기여도</div>
          <div className="flex flex-row w-full h-[270px] mt-2 justify-center">
            <Pie data={data2} />
          </div>
        </div>
      </div>

      <div className="flex flex-row font-apple justify-start ml-4">즐겨찾기</div>

      {isLoading ? (
        <p className="text-center text-gray-400 mt-10">차트를 불러오는 중입니다...</p>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-3 gap-4 pb-4">
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
          </div>
        </DndProvider>
      )}
    </div>
  )
}
