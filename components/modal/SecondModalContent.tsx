'use client'

// 필요한 라이브러리와 컴포넌트 import
import {useEffect, useState} from 'react'
import {Button} from '@/components/ui/button'
import {deleteChart, saveChartConfig, updateChart} from '@/services/chart-config'
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
import {useESGModal} from './ESGModalContext'

// Chart.js 구성요소 등록
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

// 차트 타입별 컴포넌트 매핑
const chartComponentMap = {Bar, Line, Pie, Doughnut, PolarArea, Radar}

// 아이콘용 차트 타입 배열
const chartIcons = [
  {type: 'Bar', image: '/images/bar-graph.png'},
  {type: 'Line', image: '/images/line-graph.png'},
  {type: 'Pie', image: '/images/pie-chart.png'},
  {type: 'Doughnut', image: '/images/doughnut-graph.png'},
  {type: 'PolarArea', image: '/images/polar-area.png'},
  {type: 'Radar', image: '/images/radar-chart.png'}
]

// 차트 자동 추천 함수
function recommendChartTypes(rows, years) {
  const indicatorsCount = rows.length
  const yearsCount = years.length
  const isTimeSeries = rows.every(row => {
    const valueYears = Object.keys(row.values || {})
    return years.every(y => valueYears.includes(y.toString()))
  })

  // 조건별 추천
  if (indicatorsCount === 1 && yearsCount > 1 && isTimeSeries) return ['Bar', 'Line']
  if (indicatorsCount > 1 && yearsCount === 1)
    return ['Bar', 'Pie', 'Doughnut', 'PolarArea', 'Radar']
  if (indicatorsCount > 1 && yearsCount > 1) return ['Bar', 'Line']
  return ['Bar']
}

//----------------------------------------------------------------------------------------------------

// 차트에 표시할 label 생성 함수
function generateLabel(row, indicators) {
  const indicator = indicators.find(i => i.key === row.indicatorKey)
  const baseLabel = indicator?.label || row.indicatorKey
  const parts = [row.field1, row.field2].filter(Boolean).join(' / ')
  const unit = row.unit || indicator?.unit || ''
  return `${baseLabel}${parts ? ` (${parts}` : ''}${
    parts && unit ? ` / ${unit})` : unit ? ` (${unit})` : parts ? ')' : ''
  }`
}
//----------------------------------------------------------------------------------------------------

// 메인 컴포넌트
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
  onBack,
  onChartSaved,
  closeModal,
  refetchCharts
}: SecondModalContentProps) {
  const [selectedChart, setSelectedChart] = useState(chartType || null)
  const [availableCharts, setAvailableCharts] = useState<string[]>([])
  const {isEditModalOpen, chartToEdit} = useESGModal()
  const pathname = usePathname()
  // 경로 기반 카테고리 추출
  const category = pathname.includes('social')
    ? 'social'
    : pathname.includes('environmental')
    ? 'environmental'
    : 'governance'

  const niceColorPalette = [
    '#A8DADC', // 부드러운 민트
    '#F4A261', // 살구 오렌지
    '#E76F51', // 연한 토마토 레드
    '#B5E48C', // 연두색
    '#FFD6A5', // 복숭아색
    '#D3C0F9', // 연보라
    '#FDCBBA', // 살구빛 핑크
    '#D2E3C8', // 연한 올리브 그린
    '#BDE0FE', // 연한 하늘색
    '#FFCAD4' // 베이비 핑크
  ]

  const getNiceColor = (index: number) => {
    return niceColorPalette[index % niceColorPalette.length]
  }

  //----------------------------------------------------------------------------------------------------

  // 차트 자동 추천
  useEffect(() => {
    const recommended = recommendChartTypes(rows, years)
    setAvailableCharts(recommended)
    if (recommended.length > 0) {
      setSelectedChart(recommended[0])
      setChartType?.(recommended[0])
    }
  }, [rows, years])
  //----------------------------------------------------------------------------------------------------

  useEffect(() => {
    if (isEditModalOpen && chartToEdit) {
      if (!chartToEdit.dashboardId) {
        toast.error('dashboardId가 없습니다. 수정 요청 실패 ⚠️')
      }

      setSelectedRows(chartToEdit.fields?.map((_, i) => i) || [])
      setColorSet(chartToEdit.fields?.map(f => f.color || '#cccccc') || [])
      setTitle(chartToEdit.title || '')
      setChartType(chartToEdit.chartType || 'Bar')
      setSelectedChart(chartToEdit.chartType || 'Bar')
    }
  }, [isEditModalOpen, chartToEdit])
  //----------------------------------------------------------------------------------------------------

  useEffect(() => {
    setSelectedRows?.(prev => prev.filter(i => i >= 0 && i < rows.length))
  }, [rows])
  //----------------------------------------------------------------------------------------------------
  // 모달 닫을 때 기본값 초기화
  useEffect(() => {
    if (!isEditModalOpen) {
      // 생성 모드일 때 기본값 초기화
      setTitle('')
      setSelectedChart(null)
      setChartType('')
      setColorSet([])
      setSelectedRows([])
    }
  }, [isEditModalOpen])
  //----------------------------------------------------------------------------------------------------
  // 색상 변경
  const handleColorChange = (index: number, newColor: string) => {
    const updated = [...colorSet]
    updated[index] = newColor
    setColorSet(updated)
  }
  //----------------------------------------------------------------------------------------------------

  // 파이계열 여부
  const isPieLike = ['Pie', 'Doughnut', 'PolarArea', 'Radar'].includes(selectedChart)
  //----------------------------------------------------------------------------------------------------
  // 차트 데이터 구성
  const chartData = isPieLike
    ? {
        labels: selectedRows
          .map(i => rows[i])
          .filter(Boolean)
          .map(row => generateLabel(row, indicators)),
        datasets: [
          {
            data: selectedRows
              .map(i => rows[i])
              .filter(Boolean)
              .map(row => Number(row.values?.[years[0]]) || 0),
            backgroundColor: colorSet
          }
        ]
      }
    : {
        labels: years,
        datasets: selectedRows
          .map((rowIndex, idx) => {
            const row = rows[rowIndex]
            if (!row) return null
            return {
              label: generateLabel(row, indicators),
              data: years.map(y => Number(row.values?.[y]) || 0),
              backgroundColor: colorSet[idx % colorSet.length],
              borderColor: colorSet[idx % colorSet.length],
              borderWidth: 2
            }
          })
          .filter(Boolean) // null 제거
      }

  //----------------------------------------------------------------------------------------------------

  // 차트 옵션
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
  //랜덤 색상 생성 함수
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
  //----------------------------------------------------------------------------------------------------
  //colorset 랜덤 초기화
  useEffect(() => {
    if (colorSet.length < selectedRows.length) {
      const newColors = selectedRows.map((_, idx) => getNiceColor(idx))
      setColorSet(newColors)
    }
  }, [selectedRows])

  //----------------------------------------------------------------------------------------------------

  // 저장 버튼 클릭 핸들러
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

      // 저장 후 콜백 실행 (차트 포맷 재가공)
      if (onChartSaved) {
        const dashboardId = res.data._id
        const userId = res.data.userId
        const chart = res.data.charts?.[0]

        const formatted = {
          ...chart,
          _id: chart._id,
          chartId: chart._id,
          dashboardId,
          userId,
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

      // 모달 닫기
      setTimeout(() => {
        closeModal?.()
      }, 100)
    } catch (error) {
      toast.error('차트 저장 중 오류가 발생했습니다.')
    }
  }
  //----------------------------------------------------------------------------------------------------

  // 수정 저장 핸들러
  const handleUpdate = async () => {
    if (!chartToEdit?.dashboardId || !chartToEdit?._id) {
      toast.error('차트 정보가 올바르지 않습니다.')
      return
    }

    try {
      // ✅ 첫 번째 row에서 unit 추출 (없으면 indicator 단위 참고)
      const firstRow = rows[selectedRows[0]]
      const fallbackUnit = indicators.find(
        ind => ind.key === firstRow?.indicatorKey
      )?.unit

      const updateDto = {
        chartType: selectedChart,
        title,
        unit: firstRow?.unit || fallbackUnit || '기본단위', // ✅ 빈 문자열 방지
        years,
        fields: selectedRows.map((rowIndex, i) => {
          const row = rows[rowIndex]
          const fallbackUnit = indicators.find(ind => ind.key === row?.indicatorKey)?.unit
          return {
            key: row.indicatorKey,
            label:
              indicators.find(ind => ind.key === row.indicatorKey)?.label ||
              row.indicatorKey,
            field1: row.field1,
            field2: row.field2,
            unit: row.unit || fallbackUnit || '기본단위', // ✅ 각 필드에도 unit 보장
            color: colorSet[i],
            data: Object.fromEntries(years.map(y => [y, Number(row.values[y] || 0)]))
          }
        })
      }

      const updated = await updateChart({
        dashboardId: chartToEdit.dashboardId,
        chartId: chartToEdit._id,
        updateDto
      })

      toast.success('차트 수정 완료! 🎉')

      if (onChartSaved) {
        onChartSaved({
          _id: chartToEdit._id,
          dashboardId: chartToEdit.dashboardId,
          chartType: selectedChart.toLowerCase(),
          title,
          years,
          fields: updateDto.fields
        })
      }

      setTimeout(() => closeModal?.(), 200)
    } catch (err) {
      toast.error('차트 수정에 실패했습니다 ❌')
    }
  }

  //----------------------------------------------------------------------------------------------------

  // 삭제 핸들러
  const handleDelete = async () => {
    const confirm = window.confirm('정말 삭제하시겠습니까? 🗑️')
    if (!confirm) return

    try {
      await deleteChart({
        dashboardId: chartToEdit.dashboardId,
        chartId: chartToEdit._id
      })

      toast.success('차트가 삭제되었습니다!')

      // SecondModalContent.tsx → handleDelete 안에서 이걸 꼭 해줘야 함
      if (onChartSaved) {
        onChartSaved({
          _id: chartToEdit._id,
          deleted: true
        })
      }

      setTimeout(() => closeModal?.(), 200)
    } catch (error) {
      toast.error('차트 삭제 중 오류가 발생했습니다 ❌')
    }
  }
  //----------------------------------------------------------------------------------------------------
  return (
    <div className="flex flex-col overflow-auto">
      <div className="font-apple text-2xl border-b pb-4 mb-6">
        <h2>그래프 선택</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between">
        {/* 왼쪽 설정 영역 */}
        <div className="flex flex-col w-full md:w-[50%]">
          <h3 className="font-apple mb-4">그래프 종류 선택</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 w-96">
            {chartIcons
              .filter(({type}) => availableCharts.includes(type))
              .map(({type, image}) => (
                <button
                  key={type}
                  className={`w-20 h-20 rounded-lg border flex items-center justify-center shadow-sm ${
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

          {/* 데이터 선택 및 컬러 선택 */}
          <div className="flex flex-row items-center mb-2">
            <h3 className="font-apple min-w-[90px]">데이터 선택</h3>
            {selectedRows.length < rows.length && (
              <Button
                className="text-sm bg-green-400 hover:bg-green-300 px-3 py-1 mr-3 font-apple"
                onClick={() => {
                  const unusedIndex = rows.findIndex((_, i) => !selectedRows.includes(i))
                  if (unusedIndex !== -1) {
                    setSelectedRows([...selectedRows, unusedIndex])
                    setColorSet([...colorSet, '#88CCE6'])
                  }
                }}>
                + 지표 추가
              </Button>
            )}
            {selectedRows.length > 1 && (
              <Button
                className="text-sm bg-red-400 hover:bg-red-300 px-3 py-1 mr-3 font-apple"
                onClick={() => {
                  setSelectedRows(selectedRows.slice(0, -1))
                  setColorSet(colorSet.slice(0, -1))
                }}>
                - 삭제
              </Button>
            )}
            {/* 지표별 선택 및 색상 설정 */}
            <Button
              onClick={() => {
                const randomColors = selectedRows.map(() => getRandomColor())
                setColorSet(randomColors)
              }}
              className="text-sm bg-blue-400 hover:bg-blue-300 px-3 py-1 mr-3 font-apple">
              랜덤 색상
            </Button>
          </div>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="차트 제목을 입력하세요"
            className="px-4 py-2 border rounded font-apple mb-2 w-[50%]"
          />

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

        {/* 오른쪽: 차트 미리보기 영역 */}
        <div className="flex flex-col w-full md:w-[50%] items-center">
          <div className="bg-white-100 w-full max-w-full rounded-xl flex overflow-x-auto">
            <div className="flex w-full h-auto min-h-[500px] max-h-[500px] justify-center">
              {selectedChart &&
                chartComponentMap[selectedChart] &&
                React.createElement(chartComponentMap[selectedChart], {
                  data: chartData,
                  options: chartOptions
                })}
            </div>
          </div>
          <div className="flex justify-end w-full mt-4 gap-2">
            <Button
              className="bg-gray-300 hover:bg-gray-200 text-black px-4 py-2 rounded font-apple"
              onClick={onBack}>
              &lt; 이전
            </Button>

            {isEditModalOpen ? (
              <>
                <Button
                  className="bg-red-400 hover:bg-red-300 text-white px-4 py-2 rounded font-apple"
                  onClick={handleDelete}>
                  삭제
                </Button>
                <Button
                  className="bg-blue-400 hover:bg-blue-300 text-white px-4 py-2 rounded font-apple"
                  onClick={handleUpdate}>
                  수정 저장
                </Button>
              </>
            ) : (
              <Button
                className="bg-black hover:bg-blue-400 text-white px-4 py-2 rounded font-apple"
                onClick={handleSave}>
                저장
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
