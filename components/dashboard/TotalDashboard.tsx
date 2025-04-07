// TotalDashboard.tsx
'use client'

import {useEffect, useState} from 'react'
import {useESGModal} from '@/components/modal/ESGModalContext'
import GridItem from './GridItem'
import {fetchUserCharts, updateChartOrder} from '@/services/chart-config'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'
import {Bar, Doughnut, Pie} from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import GoalsModal from '@/components/modal/goalsModal'
import {fetchGoalsByCategory, fetchIndicatorsWithPrevYearData} from '@/services/esg-goal'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

export default function TotalDashboard() {
  const [gridItems, setGridItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const {setIsModalOpen, reset, setIsGoalModalOpen} = useESGModal()

  const ESG_COLORS = {
    Environmental: '#B5E48C',
    Social: '#BDE0FE',
    Governance: '#FFCAD4'
  }

  const [goalData, setGoalData] = useState({
    Environmental: [],
    Social: [],
    Governance: []
  })

  const [selectedIndicators, setSelectedIndicators] = useState({
    Environmental: '',
    Social: '',
    Governance: ''
  })

  const currentYear = new Date().getFullYear()

  const loadGoalData = async () => {
    try {
      const fetchByCategory = async (category: string) => {
        const [indicators, goals] = await Promise.all([
          fetchIndicatorsWithPrevYearData(category, currentYear),
          fetchGoalsByCategory(category, currentYear)
        ])

        return goals.map(goal => {
          const matched = indicators.find(i => i.key === goal.indicatorKey)
          return {
            ...goal,
            label: matched?.label ?? goal.indicatorKey,
            prevValue: matched?.prevValue ?? null
          }
        })
      }

      const [env, soc, gov] = await Promise.all([
        fetchByCategory('environmental'),
        fetchByCategory('social'),
        fetchByCategory('governance')
      ])

      setGoalData({Environmental: env, Social: soc, Governance: gov})
      setSelectedIndicators({
        Environmental: env[0]?.label ?? '',
        Social: soc[0]?.label ?? '',
        Governance: gov[0]?.label ?? ''
      })
    } catch (err) {
      console.error('🎯 목표 로딩 실패:', err)
    }
  }

  useEffect(() => {
    const loadFavoriteCharts = async () => {
      try {
        const data = await fetchUserCharts('')
        const favoritesOnly = data
          .filter(chart => chart.isFavorite)
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

  const handleGoalClick = () => setIsGoalModalOpen(true)

  const handleIndicatorSelect = (category: string, label: string) => {
    setSelectedIndicators(prev => ({...prev, [category]: label}))
  }

  const getContributionRatio = () => {
    const e = goalData.Environmental.length
    const s = goalData.Social.length
    const g = goalData.Governance.length
    const total = e + s + g

    return total === 0
      ? {labels: ['N/A'], datasets: [{data: [1], backgroundColor: ['#cccccc']}]}
      : {
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
    <div className="flex flex-col px-6 py-4 w-full h-full font-apple ">
      <div className="grid grid-cols-[3fr_1fr] w-full gap-6 mb-2">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-bold">Total ESG Dashboard</h2>
          <button
            className="border px-4 py-1 rounded-xl bg-white shadow text-sm"
            onClick={handleGoalClick}>
            목표 설정
          </button>
        </div>
      </div>
      <GoalsModal onGoalsSaved={loadGoalData} />
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
        <div className="bg-white rounded-xl shadow-md border p-4 flex flex-col items-center gap-y-4">
          {['Environmental', 'Social', 'Governance'].map(label => (
            <div key={label} className="flex flex-col  w-full gap-y-2">
              <ComboboxWithCreate
                items={goalData[label].map(goal => goal.label)}
                selected={selectedIndicators[label]}
                placeholder={`${label} 지표 선택`}
                onAdd={() => {}}
                onSelect={value => handleIndicatorSelect(label, value)}
              />

              {/* ✅ 지표 이름을 차트 위에 표시 */}
              {selectedIndicators[label] && (
                <p className="flex flex-row text-sm font-semibold text-gray-600 mb-2 justify-center">
                  {selectedIndicators[label]}
                </p>
              )}

              <div className="min-h-[10px] h-auto w-full px-6">
                <Bar
                  data={{
                    labels: [selectedIndicators[label] || 'N/A'],
                    datasets: [
                      {
                        label: '현재 값',
                        data: [
                          goalData[label].find(g => g.label === selectedIndicators[label])
                            ?.currentValue || 0
                        ],
                        backgroundColor: ESG_COLORS[label],
                        barThickness: 30
                      },
                      {
                        label: '남은 목표치',
                        data: [
                          (() => {
                            const selected = goalData[label].find(
                              g => g.label === selectedIndicators[label]
                            )
                            if (!selected) return 0
                            return Math.max(
                              0,
                              selected.targetValue - selected.currentValue
                            )
                          })()
                        ],
                        backgroundColor: '#eeeeee',
                        barThickness: 20
                      }
                    ]
                  }}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                      padding: {
                        left: 0,
                        right: 40,
                        top: 10,
                        bottom: 10
                      }
                    },
                    plugins: {
                      legend: {position: 'bottom'},
                      datalabels: {
                        anchor: 'end',
                        align: 'end',
                        formatter: (value, context) => {
                          const datasets = context.chart.data.datasets
                          const currentVal = datasets[0].data[0] as number
                          const total = currentVal + (datasets[1].data[0] as number)
                          const percent = total
                            ? Math.round((currentVal / total) * 100)
                            : 0
                          return `${percent}%`
                        },
                        color: '#333',
                        font: {
                          weight: 'bold',
                          size: 15
                        },
                        display: context => context.datasetIndex === 0 // 남은 목표치 바에는 라벨 안 달리게
                      },
                      tooltip: {
                        callbacks: {
                          label: context =>
                            `${context.dataset.label}: ${context.raw.toLocaleString()}`
                        }
                      }
                    },
                    scales: {
                      x: {
                        stacked: true,
                        beginAtZero: true
                      },
                      y: {
                        stacked: true,
                        ticks: {
                          display: false // ✅ y축 텍스트 제거
                        },
                        grid: {
                          drawTicks: false // ✅ y축 tick 라인 제거 (옵션)
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col bg-white rounded-xl shadow-md border p-4 gap-y-12">
          <div>
            <h3 className="text-center mb-2 font-semibold">기여도</h3>
            <div className="h-[300px] flex justify-center items-center">
              <Doughnut data={getContributionRatio()} />
            </div>
          </div>
          <div>
            <h3 className="text-center font-semibold">기여도</h3>
            <div className="h-[300px] flex justify-center items-center">
              <Bar data={getContributionRatio()} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2 mt-6">즐겨찾기</h3>
        {isLoading ? (
          <p className="text-gray-400">차트를 불러오는 중입니다...</p>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      const formatted = orderedWithOrder.map(
                        ({_id, order, dashboardId}) => ({
                          chartId: _id,
                          dashboardId,
                          newOrder: order
                        })
                      )
                      await updateChartOrder(formatted)
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
                  onFavoriteToggle={(chartId, isFavorite) => {
                    if (!isFavorite) {
                      setGridItems(prev => prev.filter(chart => chart._id !== chartId))
                    }
                  }}
                />
              ))}
            </div>
          </DndProvider>
        )}
      </div>
    </div>
  )
}
