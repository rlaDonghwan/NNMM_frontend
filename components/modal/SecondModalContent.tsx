'use client'

import {useEffect, useState} from 'react'
import {Button} from '@/components/ui/button'
import {saveChartConfig} from '@/services/chart-config'
import {Bar, Line, Pie, Doughnut, PolarArea, Radar} from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  RadialLinearScale
} from 'chart.js'
import React from 'react'
import toast from 'react-hot-toast'
import {usePathname} from 'next/navigation'
import {showWarning} from '@/utils/toast'
import {SecondModalContentProps} from '@/interface/modal'

ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  RadialLinearScale
)

const chartComponentMap = {Bar, Line, Pie, Doughnut, PolarArea, Radar}
const chartIcons = [
  {type: 'Bar', image: '/images/bar-graph.png'},
  {type: 'Line', image: '/images/line-graph.png'},
  {type: 'Pie', image: '/images/pie-chart.png'},
  {type: 'Doughnut', image: '/images/doughnut-graph.png'},
  {type: 'PolarArea', image: '/images/polar-area.png'},
  {type: 'Radar', image: '/images/radar-chart.png'}
]

function recommendChartTypes(rows, years) {
  const indicatorsCount = rows.length
  const yearsCount = years.length
  const isTimeSeries = rows.every(row => {
    const valueYears = Object.keys(row.values || {})
    return years.every(y => valueYears.includes(y.toString()))
  })

  if (indicatorsCount === 1 && yearsCount > 1 && isTimeSeries) return ['Bar', 'Line']
  if (indicatorsCount > 1 && yearsCount === 1)
    return ['Pie', 'Doughnut', 'PolarArea', 'Radar']
  if (indicatorsCount > 1 && yearsCount > 1) return ['Line']
  return ['Bar']
}

function generateLabel(row, indicators) {
  const indicator = indicators.find(i => i.key === row.indicatorKey)
  const baseLabel = indicator?.label || row.indicatorKey
  const parts = [row.field1, row.field2].filter(Boolean).join(' / ')
  const unit = row.unit || indicator?.unit || ''

  return `${baseLabel}${parts ? ` (${parts}` : ''}${
    parts && unit ? ` / ${unit})` : unit ? ` (${unit})` : parts ? ')' : ''
  }`
}

export default function SecondModalContent({
  years,
  setYears,
  rows,
  setRows,
  indicators,
  setIndicators,
  onAddYear,
  onRemoveYear,
  onRemoveRow,
  onValueChange,
  getUnit,
  onSubmit,
  onAddRowWithIndicator,
  onIndicatorChange,
  onBack,
  onSubmitPage,
  chartType,
  setChartType,
  title,
  setTitle,
  selectedRows,
  setSelectedRows,
  colorSet,
  setColorSet
}: SecondModalContentProps) {
  const [selectedChart, setSelectedChart] = useState(chartType || null)
  const [availableCharts, setAvailableCharts] = useState<string[]>([])
  const pathname = usePathname()
  const category = pathname.includes('social')
    ? 'social'
    : pathname.includes('environmental')
    ? 'environmental'
    : 'governance'

  useEffect(() => {
    const recommended = recommendChartTypes(rows, years)
    setAvailableCharts(recommended)
    if (recommended.length > 0) setSelectedChart(recommended[0])
  }, [rows, years])

  const handleColorChange = (index: number, newColor: string) => {
    const updated = [...colorSet]
    updated[index] = newColor
    setColorSet(updated)
  }

  const isPieLike = ['Pie', 'Doughnut', 'PolarArea', 'Radar'].includes(selectedChart)

  const chartData = isPieLike
    ? {
        labels: selectedRows.map(i => generateLabel(rows[i], indicators)),
        datasets: [
          {
            data: selectedRows.map(i => Number(rows[i].values[years[0]]) || 0),
            backgroundColor: colorSet
          }
        ]
      }
    : {
        labels: years,
        datasets: selectedRows.map((rowIndex, idx) => {
          const row = rows[rowIndex]
          return {
            label: generateLabel(row, indicators),
            data: years.map(y => Number(row.values[y]) || 0),
            backgroundColor: colorSet[idx % colorSet.length],
            borderColor: colorSet[idx % colorSet.length],
            borderWidth: 2
          }
        })
      }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {display: true, position: 'top'},
      title: {
        display: true,
        text: title || 'ESG 차트 미리보기',
        font: {size: 18, weight: 'bold', fontFamily: 'font-apple'}
      }
    },
    scales: isPieLike ? {} : {y: {beginAtZero: true}}
  }

  function onChartSaved(data: any) {
    throw new Error('Function not implemented.')
  }

  return (
    <div className="p-6 rounded-xl bg-white w-auto mx-auto font-apple">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold">그래프 선택</h2>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* 그래프 종류 선택 */}
        <div className="col-span-1 space-y-4">
          <h3 className="font-apple">그래프 종류 선택</h3>
          <div className="grid grid-cols-2 gap-[2px]">
            {chartIcons
              .filter(({type}) => availableCharts.includes(type))
              .map(({type, image}) => (
                <button
                  key={type}
                  className={`w-20 h-20 rounded-lg border flex items-center justify-center shadow-sm ${
                    selectedChart === type ? 'border-black' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedChart(type)}>
                  <img src={image} alt={type} className="w-10 h-10 object-contain" />
                </button>
              ))}
          </div>
        </div>

        {/* 데이터 선택 */}
        <div className="col-span-1 space-y-2">
          <h3 className="font-apple">데이터 선택</h3>
          <div className="flex flex-col gap-2">
            {selectedRows.map((rowIndex, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <select
                  className="flex-1 border rounded px-2 py-1"
                  value={rowIndex}
                  onChange={e => {
                    const newSelected = [...selectedRows]
                    newSelected[idx] = Number(e.target.value)
                    setSelectedRows(newSelected)
                  }}>
                  {rows
                    .filter((_, i) => !selectedRows.includes(i) || i === rowIndex)
                    .map((row, i) => (
                      <option key={i} value={i}>
                        {generateLabel(row, indicators)}
                      </option>
                    ))}
                </select>
                <input
                  type="color"
                  className="w-6 h-6 border rounded"
                  value={colorSet[idx]}
                  onChange={e => handleColorChange(idx, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-2">
            {selectedRows.length < rows.length && (
              <Button
                className="text-sm bg-green-200 hover:bg-green-300 px-3 py-1"
                onClick={() => {
                  const unusedIndex = rows.findIndex((_, i) => !selectedRows.includes(i))
                  if (unusedIndex !== -1) {
                    setSelectedRows([...selectedRows, unusedIndex])
                    setColorSet([...colorSet, '#A78BFA'])
                  }
                }}>
                + 지표 추가
              </Button>
            )}
            {selectedRows.length > 1 && (
              <Button
                className="text-sm bg-red-200 hover:bg-red-300 px-3 py-1"
                onClick={() => {
                  setSelectedRows(selectedRows.slice(0, -1))
                  setColorSet(colorSet.slice(0, -1))
                }}>
                - 삭제
              </Button>
            )}
          </div>
        </div>

        {/* 차트 제목 + 미리보기 */}
        <div className="col-span-2 space-y-4">
          <div>
            <h3 className="font-apple">그래프 제목</h3>
            <input
              type="text"
              value={title || ''} // undefined일 땐 빈 문자열 처리
              onChange={e => setTitle(e.target.value)}
              placeholder="차트 제목을 입력하세요"
              className="w-full px-4 py-2 border rounded font-apple"
            />
          </div>

          <h3 className="font-apple mt-4">그래프 미리보기</h3>
          <div className="bg-white-100 w-full max-w-full rounded-xl h-64 flex items-center justify-center overflow-x-auto">
            <div className="w-[90%] h-full p-4">
              {selectedChart &&
                chartComponentMap[selectedChart] &&
                React.createElement(chartComponentMap[selectedChart], {
                  data: chartData,
                  options: chartOptions
                })}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 저장 버튼 */}
      <div className="w-full bg-white rounded-xl shadow p-6">
        <div className="flex justify-end mt-6 gap-3">
          <Button
            onClick={onBack}
            className="bg-gray-200 text-black text-lg px-8 py-2 rounded-full hover:bg-gray-300">
            &lt; 이전
          </Button>
          <Button
            onClick={async () => {
              const isTitleValid = title.trim().length > 0
              const isChartSelected = !!selectedChart
              const isDataSelected = selectedRows.length > 0

              if (!isChartSelected && !isDataSelected && !isTitleValid) {
                showWarning('그래프 종류, 데이터, 제목을 모두 입력해주세요.')
                return
              } else if (!isChartSelected) {
                showWarning('그래프 종류를 선택해주세요.')
                return
              } else if (!isDataSelected) {
                showWarning('데이터를 1개 이상 선택해주세요.')
                return
              } else if (!isTitleValid) {
                showWarning('차트 제목을 입력해주세요.')
                return
              }
              try {
                const res = await saveChartConfig({
                  chartType: selectedChart,
                  selectedRows,
                  rows,
                  indicators,
                  colorSet,
                  years,
                  title,
                  category
                })

                // ✅ 저장 성공 후, 콜백 실행
                if (onChartSaved) onChartSaved(res.data)

                toast.success('차트 저장에 성공했습니다!')
              } catch (error) {
                toast.error('차트 저장 중 오류가 발생했습니다.')
              }
            }}>
            저장✔
          </Button>
        </div>
      </div>
    </div>
  )
}
