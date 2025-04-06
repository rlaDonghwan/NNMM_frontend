'use client'

import {useEffect, useState} from 'react'
import {useESGModal} from '@/components/modal/ESGModalContext'
import GridItem from './GridItem'
import {fetchUserCharts, updateChartOrder} from '@/services/chart-config'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'
import {Pie} from 'react-chartjs-2'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import GoalsModal from '@/components/modal/goalsModal'
import {fetchGoalsByCategory} from '@/services/esg-goal'

export default function TotalDashboard() {
  const [gridItems, setGridItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const {setIsModalOpen, reset, setIsGoalModalOpen} = useESGModal()

  const ESG_COLORS = {
    Environmental: '#2ECC71',
    Social: '#3498DB',
    Governance: '#9B59B6'
  }

  const [goalData, setGoalData] = useState({
    Environmental: [],
    Social: [],
    Governance: []
  })

  const [selectedIndicators, setSelectedIndicators] = useState({
    Environmental: null,
    Social: null,
    Governance: null
  })

  const currentYear = new Date().getFullYear()

  // ✅ 목표 리로드 함수 (올해 목표 + 작년 기준 지표)
  const loadGoalData = async () => {
    try {
      const [env, soc, gov] = await Promise.all([
        fetchGoalsByCategory('environmental', currentYear),
        fetchGoalsByCategory('social', currentYear),
        fetchGoalsByCategory('governance', currentYear)
      ])

      setGoalData({
        Environmental: env,
        Social: soc,
        Governance: gov
      })

      setSelectedIndicators({
        Environmental: env.length > 0 ? env[0].indicatorKey : null,
        Social: soc.length > 0 ? soc[0].indicatorKey : null,
        Governance: gov.length > 0 ? gov[0].indicatorKey : null
      })
    } catch (err) {
      console.error('목표값 로딩 실패:', err)
    }
  }

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
    loadGoalData()
  }, [])

  const handleGoalClick = () => {
    setIsGoalModalOpen(true)
  }

  const handleIndicatorSelect = (category: string, indicatorKey: string) => {
    setSelectedIndicators(prev => ({
      ...prev,
      [category]: indicatorKey
    }))
  }

  const getPieDataForIndicator = (category: string) => {
    const selectedKey = selectedIndicators[category]
    const data = goalData[category] || []
    const selected = data.find(d => d.indicatorKey === selectedKey)

    if (!selected || !selected.targetValue || !selected.prevValue) {
      return {
        labels: ['N/A'],
        datasets: [{data: [1], backgroundColor: ['#cccccc']}]
      }
    }

    const prev = selected.prevValue
    const target = selected.targetValue
    const increase = target - prev
    const percentChange = ((increase / prev) * 100).toFixed(1)

    return {
      labels: ['작년 값', '증가분'],
      datasets: [
        {
          data: [prev, increase],
          backgroundColor: [ESG_COLORS[category], '#eeeeee']
        }
      ]
    }
  }

  const getContributionRatio = () => {
    const e = goalData.Environmental.length
    const s = goalData.Social.length
    const g = goalData.Governance.length
    const total = e + s + g

    if (total === 0) {
      return {
        labels: ['N/A'],
        datasets: [{data: [1], backgroundColor: ['#cccccc']}]
      }
    }

    return {
      labels: ['E', 'S', 'G'],
      datasets: [
        {
          data: [e, s, g],
          backgroundColor: [
            ESG_COLORS.Environmental,
            ESG_COLORS.Social,
            ESG_COLORS.Governance
          ]
        }
      ]
    }
  }

  return (
    <div className="flex flex-col gap-y-4 w-full h-screen">
      <button
        className="w-[110px] h-[36px] border-2 rounded-xl font-apple"
        onClick={handleGoalClick}>
        목표 설정
      </button>

      {/* ✅ 콜백 전달 */}
      <GoalsModal onGoalsSaved={loadGoalData} />

      {/* ESG 요약 차트 및 기여도 영역 */}
      <div className="grid grid-cols-[2.02fr_0.98fr] gap-4 h-full w-full">
        <div className="bg-white rounded-xl shadow-lg border-2 p-4 h-[400px]">
          <div className="flex flex-row gap-x-20 justify-center">
            {['Environmental', 'Social', 'Governance'].map(label => (
              <div key={label}>
                <div className="flex justify-center">
                  <ComboboxWithCreate
                    items={goalData[label].map(goal => goal.indicatorKey)}
                    selected={selectedIndicators[label] || ''}
                    placeholder={`${label} 지표 선택`}
                    onAdd={() => {}}
                    onSelect={value => handleIndicatorSelect(label, value)}
                  />
                </div>
                <div className="h-[320px] mt-2">
                  <Pie data={getPieDataForIndicator(label)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-2 p-4 h-[400px]">
          <div className="flex justify-center font-apple">기여도</div>
          <div className="flex h-[320px] mt-2 justify-center">
            <Pie data={getContributionRatio()} />
          </div>
        </div>
      </div>

      {/* 즐겨찾기 차트 */}
      <div className="flex font-apple ml-4">즐겨찾기</div>
      {isLoading ? (
        <p className="text-center text-gray-400 mt-10 font-apple">
          차트를 불러오는 중입니다...
        </p>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-3 gap-4 pb-4">
            {gridItems.map((item, index) => (
              <GridItem
                key={item._id}
                item={item}
                index={index}
                isLast={false}
                moveItem={async (dragIndex, hoverIndex) => {
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
                    const formattedForRequest = orderedWithOrder.map(
                      ({_id, order, dashboardId}) => ({
                        chartId: _id,
                        dashboardId,
                        newOrder: order
                      })
                    )
                    await updateChartOrder(formattedForRequest)
                  } catch (err) {
                    console.error('순서 저장 실패:', err)
                  }
                }}
                handleClick={item => {
                  setIsModalOpen(true, newChart => {
                    setGridItems(prev => {
                      const exists = prev.some(i => i._id === newChart._id)
                      return exists
                        ? prev.map(i => (i._id === newChart._id ? newChart : i))
                        : [...prev, newChart]
                    })
                    setTimeout(() => {
                      reset()
                      setIsModalOpen(false)
                    }, 100)
                  })
                }}
              />
            ))}
          </div>
        </DndProvider>
      )}
    </div>
  )
}
