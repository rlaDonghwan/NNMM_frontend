'use client'

import {useEffect, useState} from 'react'
import {useESGModal} from '@/components/modal/ESGModalContext'
import GridItem from './GridItem'
import {fetchUserCharts, updateChartOrder} from '@/services/chart-config'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'
import {Bar, Pie} from 'react-chartjs-2'

export default function TotalDashboard() {
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
        const filtered = data.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
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
    labels: ['Jan'],
    datasets: [
      {
        label: 'Percentage',
        data: [12],
        backgroundColor: 'rgba(255, 99, 132, 0.2)'
      }
    ]
  }
  const options = {
    indexAxis: 'y' as const,
    maintainAspectRatio: false, // 📌 필수!
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
        backgroundColor: 'rgba(255, 99, 132, 0.2)'
      }
    ]
  }
  return (
    <div className="flex flex-col gap-y-4 w-full h-screen">
      {/* ---------------------------------------------------------------------------------삭제 필요 (상진이형 코드 자리) */}
      {isLoading ? (
        <p className="text-center text-gray-400 mt-10">차트를 불러오는 중입니다...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {/* 차트 카드 목록 출력 ------------------------*/}
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
        </div>
      )}
      {/* ----------------------------------------------------------------------------------------- */}
      {/* 
      - 목표 설정 버튼 >> 모달 연결 후 전항목 불러와서 목표설정 (모달 구현 필요/아직 안함)
      - 각 콤보박스: 항목 불러오기 및 최신 연도 값 불러오기
      - 계산식: 불러온 값 / 목표값 * 100 >> 달성률 >> 위 데이터 함수에 넣어주기 (data함수 3개 만들어야함)
       */}
      <div className="grid grid-cols-[2.02fr_0.98fr] gap-4 h-full w-full pb-4">
        <div className="bg-white rounded-xl shadow-lg border-2 p-4">
          <div className="flex flex-col gap-4 h-full w-full justify-center">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-4 items-center font-apple">
                <span>Environmental</span>
                <ComboboxWithCreate
                  items={['2020', '2021', '2022', '2023']}
                  placeholder="Environmental"
                  onAdd={function (newLabel: string): void {
                    throw new Error('Function not implemented.')
                  }}
                  onSelect={function (label: string): void {
                    throw new Error('Function not implemented.')
                  }}
                />
              </div>
              <button className="w-[110px] h-[36px] border-2 rounded-xl font-apple">
                목표 설정
              </button>
            </div>
            <div className="h-[100px]">
              <Bar data={data} options={options} />
            </div>
            <div className="flex flex-row gap-4 items-center font-apple">
              <span>Social</span>
              <ComboboxWithCreate
                items={['2020', '2021', '2022', '2023']}
                placeholder="Social"
                onAdd={function (newLabel: string): void {
                  throw new Error('Function not implemented.')
                }}
                onSelect={function (label: string): void {
                  throw new Error('Function not implemented.')
                }}
              />
            </div>
            <div className="h-[100px]">
              <Bar data={data} options={options} />
            </div>
            <div className="flex flex-row gap-4 items-center font-apple">
              <span>Governance</span>
              <ComboboxWithCreate
                items={['2020', '2021', '2022', '2023']}
                placeholder="Governance"
                onAdd={function (newLabel: string): void {
                  throw new Error('Function not implemented.')
                }}
                onSelect={function (label: string): void {
                  throw new Error('Function not implemented.')
                }}
              />
            </div>
            <div className="h-[100px]">
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>
        {/* 
        - E,S,G 항목 개수 가져오기
        - 전체 갯수 계산
        - 각 항목 개수 / 전체 개수 * 100 >> 파이차트 비율
        */}
        <div className="bg-white rounded-xl shadow-lg border-2">
          <Pie data={data2} />
        </div>
      </div>
    </div>
  )
}
