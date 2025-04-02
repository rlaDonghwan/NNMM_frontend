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
  rows,
  indicators,
  setSelectedRows,
  selectedRows,
  colorSet,
  setColorSet,
  setTitle,
  title,
  chartType,
  setChartType,
  onChartSaved // 부모에서 차트 저장 후 목록 업데이트 콜백
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
    if (recommended.length > 0) {
      setSelectedChart(recommended[0])
      setChartType?.(recommended[0])
    }
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

  const handleSave = async () => {
    const isChartSelected = !!selectedChart
    const isDataSelected = selectedRows.length > 0
    const isTitleValid = title && title.trim().length > 0

    if (!isChartSelected || !isDataSelected || !isTitleValid) {
      if (!isChartSelected && !isDataSelected && !isTitleValid) {
        showWarning('그래프 종류, 데이터, 제목을 모두 입력해주세요.')
      } else if (!isChartSelected) {
        showWarning('그래프 종류를 선택해주세요.')
      } else if (!isDataSelected) {
        showWarning('데이터를 1개 이상 선택해주세요.')
      } else if (!isTitleValid) {
        showWarning('차트 제목을 입력해주세요.')
      }
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

      toast.success('차트 저장에 성공했습니다!')

      if (onChartSaved) {
        const formatted = {
          ...res.data,
          chartType: selectedChart.toLowerCase(),
          title,
          years,
          fields: selectedRows.map((rowIndex, idx) => {
            const row = rows[rowIndex]
            return {
              label: generateLabel(row, indicators),
              color: colorSet[idx],
              data: row.values
            }
          })
        }
        onChartSaved(formatted)
      }
    } catch (error) {
      toast.error('차트 저장 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="flex flex-col overflow-auto">
      <div className="font-apple text-2xl border-b pb-4 mb-6">
        <h2>그래프 선택</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between">
        {/* 왼쪽 영역 */}
        <div className="flex flex-col w-full md:w-[50%]">
          <h3 className="font-apple mb-4">그래프 종류 선택</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {chartIcons
              .filter(({type}) => availableCharts.includes(type))
              .map(({type, image}) => (
                <button
                  key={type}
                  className={`w-20 h-20 rounded-lg border flex items-center justify-center shadow-sm mx-auto ${
                    selectedChart === type ? 'border-black' : 'border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedChart(type)
                    setChartType?.(type)
                  }}>
                  <img src={image} alt={type} className="w-10 h-10 object-contain" />
                </button>
              ))}
          </div>

          {/* 지표 추가/삭제 */}
          <div className="flex flex-row items-center mb-2">
            <h3 className="font-apple min-w-[90px]">데이터 선택</h3>
            {selectedRows.length < rows.length && (
              <Button
                className="text-sm bg-green-400 hover:bg-green-300 px-3 py-1 mr-3"
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
                className="text-sm bg-red-400 hover:bg-red-300 px-3 py-1 mr-3"
                onClick={() => {
                  setSelectedRows(selectedRows.slice(0, -1))
                  setColorSet(colorSet.slice(0, -1))
                }}>
                - 삭제
              </Button>
            )}
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="차트 제목을 입력하세요"
              className="w-full px-4 py-2 border rounded font-apple"
            />
          </div>

          {/* 데이터 셀렉트 및 컬러 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {selectedRows.map((rowIndex, idx) => (
              <div key={idx} className="flex items-center">
                <select
                  className="flex-1 border rounded w-[200px]"
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
                  className="w-6 h-6 border rounded ml-2"
                  value={colorSet[idx]}
                  onChange={e => handleColorChange(idx, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 차트 미리보기 + 저장 */}
        <div className="flex flex-col w-full md:w-[50%] items-center">
          <div className="bg-white-100 w-full max-w-full rounded-xl flex overflow-x-auto">
            <div className="flex w-full h-auto min-h-[400px] p-4 justify-center">
              {selectedChart &&
                chartComponentMap[selectedChart] &&
                React.createElement(chartComponentMap[selectedChart], {
                  data: chartData,
                  options: chartOptions
                })}
            </div>
          </div>

          <Button
            className="mt-4 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded"
            onClick={handleSave}>
            저장✔
          </Button>
        </div>
      </div>
    </div>
  )
}
